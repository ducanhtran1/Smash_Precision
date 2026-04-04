import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { createClient } from 'redis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const url = process.env.REDIS_URL?.trim();
    if (!url) {
      return this.getStatus(key, true, { optional: true });
    }
    const client = createClient({ url });
    try {
      await client.connect();
      await client.ping();
      return this.getStatus(key, true);
    } catch (err) {
      return this.getStatus(key, false, { message: String(err) });
    } finally {
      await client.quit().catch(() => undefined);
    }
  }
}
