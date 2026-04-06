import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  public stripe: any;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!key) throw new Error('STRIPE_SECRET_KEY not configured');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.stripe = new (Stripe as any)(key, { apiVersion: '2025-01-27.acacia' });
  }

  getWebhookSecret(): string {
    return this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
  }
}
