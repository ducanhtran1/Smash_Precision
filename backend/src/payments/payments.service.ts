import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Stripe = require('stripe');

@Injectable()
export class PaymentsService {
  public stripe: any;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
    
    this.stripe = new Stripe(key, { apiVersion: '2025-01-27.acacia' });
  }

  getWebhookSecret(): string {
    return this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
  }
}
