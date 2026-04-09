import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OrdersService } from './orders.service';
import { InventoryGateway } from '../events/inventory.gateway';
import { RedisService } from '../redis/redis.service';
import { Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

@Processor('orders', {
  stalledInterval: 300000, // Check for stalled jobs every 5 mins instead of 30s
  maxStalledCount: 1,      // Minimal retries on stalls
})
export class OrdersProcessor extends WorkerHost {
  private readonly logger = new Logger(OrdersProcessor.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly inventoryGateway: InventoryGateway,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  async process(
    job: Job<CreateOrderDto & { queueId: string }, any, string>,
  ): Promise<any> {
    const queueId = job.data.queueId;
    this.logger.log(`Processing order job: ${queueId}`);

    try {
      // 1. Run the heavyweight database action natively inside the worker
      const order = await this.ordersService.createOrder(job.data);

      this.logger.log(
        `Order job ${queueId} succeeded. DB Order ID: ${order.id}`,
      );

      // 2. Transmit success directly back to the customer's waiting UI over WebSocket
      this.inventoryGateway.server.emit(`order_status_${queueId}`, {
        status: 'success',
        orderId: order.id,
      });

      return order;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Order job ${queueId} failed: ${errorMessage}`);

      // FATAL WORKER CRASH: Provide an automatic reimbursement to the RAM stock limits.
      try {
        for (let i = 0; i < job.data.productIds.length; i++) {
          await this.redisService.incrementStock(
            job.data.productIds[i],
            job.data.quantities[i],
          );
        }
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        this.logger.error(
          `Failed to restock Redis during rollback: ${errMessage}`,
        );
      }

      // 3. Transmit the database failure (e.g., Not enough stock) over WebSocket
      this.inventoryGateway.server.emit(`order_status_${queueId}`, {
        status: 'failed',
        message: errorMessage || 'Transaction failed in processing',
      });

      throw error;
    }
  }
}
