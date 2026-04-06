import * as common from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { VnpayService } from './vnpay.service';
import { ProductsService } from '../products/products.service';
import { RedisService } from '../redis/redis.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

@common.Controller('payments')
export class PaymentsController {
  private readonly logger = new common.Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly vnpayService: VnpayService,
    private readonly productsService: ProductsService,
    private readonly redisService: RedisService,
    @InjectQueue('orders') private readonly ordersQueue: Queue,
  ) {}

  @common.Post('create-checkout-session')
  async createCheckoutSession(@common.Body() body: any, @common.Ip() ip: string) {
    const { productIds, quantities, paymentMethod } = body;

    if (!productIds || productIds.length === 0) {
      throw new common.BadRequestException('No items provided.');
    }

    // 1. Check RAM Stock availability
    const isStockAvailable = await this.redisService.decrementStock(
      productIds,
      quantities,
    );
    if (!isStockAvailable) {
      throw new common.BadRequestException(
        'Insufficient stock for one or more requested items.',
      );
    }

    let totalVndAmount = 0;
    
    // 2. Fetch secure prices from Database
    const line_items: any[] = [];
    for (let i = 0; i < productIds.length; i++) {
      const product = await this.productsService.findById(productIds[i]);
      if (!product) {
        // Fail securely
        await this.redisService.incrementStock(productIds[i], quantities[i]);
        throw new common.BadRequestException('Product not found in system.');
      }
      totalVndAmount += product.price * parseInt(quantities[i].toString()) * 25000; // Mock USD to VND conversion rate

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: product.imageUrl ? [product.imageUrl] : [],
          },
          unit_amount: Math.round(product.price * 100), // Stripe expects cents
        },
        quantity: parseInt(quantities[i].toString()),
      });
    }

    // 3. Cache the full checkout payload securely into Redis (1 hour expiration)
    const checkoutId = uuidv4();
    await this.redisService.client.set(
      `checkout:${checkoutId}`,
      JSON.stringify(body),
      'EX',
      3600,
    );

    // Use the first URL if FRONTEND_URL contains a comma-separated list
    const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    let frontendUrl = rawFrontendUrl.split(',')[0].trim();
    if (!frontendUrl.startsWith('http')) {
      frontendUrl = `https://${frontendUrl}`;
    }

    if (paymentMethod === 'vnpay') {
      const vnpayUrl = this.vnpayService.generatePaymentUrl(
        ip || '127.0.0.1',
        totalVndAmount,
        `Thanh toan don hang ${checkoutId}`,
        `${frontendUrl}/api/payments/vnpay-return`,
        checkoutId
      );
      return { url: vnpayUrl };
    }

    // 4. Generate Stripe Checkout URL
    const session = await this.paymentsService.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${frontendUrl}/thank-you`,
      cancel_url: `${frontendUrl}/checkout`,
      metadata: {
        checkoutId,
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in exactly 30 minutes
    });

    return { url: session.url };
  }

  @common.Post('webhook')
  async handleWebhook(
    @common.Headers('stripe-signature') signature: string,
    @common.Req() request: common.RawBodyRequest<Request>,
  ) {
    const rawBody = request.rawBody;
    if (!rawBody || !signature) {
      throw new common.BadRequestException('Missing raw body or signature.');
    }

    let event: any;

    try {
      event = this.paymentsService.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.paymentsService.getWebhookSecret(),
      );
    } catch (err: any) {
      this.logger.error(`Webhook Error: ${err.message}`);
      throw new common.BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Extract metadata
    const checkoutId = event.data.object.metadata?.checkoutId;
    if (!checkoutId) return { received: true };

    const payloadRaw = await this.redisService.client.get(
      `checkout:${checkoutId}`,
    );

    switch (event.type) {
      case 'checkout.session.completed':
        if (payloadRaw) {
          const payload = JSON.parse(payloadRaw);
          // Generate global queue id
          const queueId =
            Date.now().toString() + '-' + Math.floor(Math.random() * 10000);
          this.logger.log(
            `Confirmed Payment for checkoutId ${checkoutId}. Triggering BullMQ Job ${queueId}`,
          );
          await this.ordersQueue.add('process-order', { ...payload, queueId });

          // Cleanup cache
          await this.redisService.client.del(`checkout:${checkoutId}`);
        }
        break;

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed':
        if (payloadRaw) {
          const payload = JSON.parse(payloadRaw);
          // Auto-refund inventory lock!!
          this.logger.log(
            `Session expired for checkoutId ${checkoutId}, refunding RAM stock...`,
          );
          for (let i = 0; i < payload.productIds.length; i++) {
            await this.redisService.incrementStock(
              payload.productIds[i],
              payload.quantities[i],
            );
          }
          await this.redisService.client.del(`checkout:${checkoutId}`);
        }
        break;

      default:
        this.logger.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  @common.Get('vnpay-return')
  async vnpayReturn(@common.Query() query: any, @common.Res() res: any) {
    const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    let frontendUrl = rawFrontendUrl.split(',')[0].trim();
    if (!frontendUrl.startsWith('http')) frontendUrl = `https://${frontendUrl}`;

    if (this.vnpayService.verifyIpn(query)) {
      if (query.vnp_ResponseCode === '00') {
        return res.redirect(`${frontendUrl}/thank-you`);
      }
    }
    return res.redirect(`${frontendUrl}/checkout`);
  }

  @common.Get('vnpay-ipn')
  async vnpayIpn(@common.Query() query: any) {
    if (!this.vnpayService.verifyIpn(query)) {
      return { RspCode: '97', Message: 'Invalid signature' };
    }

    const checkoutId = query.vnp_TxnRef;
    const responseCode = query.vnp_ResponseCode;
    const payloadRaw = await this.redisService.client.get(`checkout:${checkoutId}`);

    if (responseCode === '00') {
      if (payloadRaw) {
        const payload = JSON.parse(payloadRaw);
        const queueId = Date.now().toString() + '-' + Math.floor(Math.random() * 10000);
        this.logger.log(`Confirmed VNPay for checkoutId ${checkoutId}. Triggering BullMQ Job ${queueId}`);
        await this.ordersQueue.add('process-order', { ...payload, queueId });
        await this.redisService.client.del(`checkout:${checkoutId}`);
      }
      return { RspCode: '00', Message: 'Confirm Success' };
    } else {
      if (payloadRaw) {
        const payload = JSON.parse(payloadRaw);
        this.logger.log(`VNPay failed for checkoutId ${checkoutId}, refunding RAM stock...`);
        for (let i = 0; i < payload.productIds.length; i++) {
          await this.redisService.incrementStock(payload.productIds[i], payload.quantities[i]);
        }
        await this.redisService.client.del(`checkout:${checkoutId}`);
      }
      return { RspCode: '00', Message: 'Confirm Failure' }; // Still return 00 ok to webhook
    }
  }
}
