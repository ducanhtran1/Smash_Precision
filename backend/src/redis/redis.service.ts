import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('REDIS_URL');
    if (!url) {
      this.logger.warn('REDIS_URL is strictly required for Tier 3 operation.');
    }
    this.client = new Redis(url ?? 'redis://localhost:6379');
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  /**
   * Resets the numeric value in RAM for an absolute inventory refresh from PostgreSQL.
   */
  async syncInventory(productId: string, stock: number) {
    this.logger.log(`Syncing ${productId} stock: ${stock}`);
    await this.client.set(`product:${productId}:stock`, stock);
  }

  /**
   * Refund an item back to the open market in case of a backend ticket cancellation.
   */
  async incrementStock(productId: string, quantity: number) {
    this.logger.log(`Refunding ${quantity} back to product:${productId}:stock`);
    await this.client.incrby(`product:${productId}:stock`, quantity);
  }

  /**
   * Atomically decrements stock for multiple items.
   * Because Redis is single-threaded, this guarantees 100% mathematical accuracy without PostgreSQL row locks.
   * Returns true if ALL items succeeded, false if ANY item has insufficient stock.
   */
  async decrementStock(
    productIds: string[],
    quantities: number[],
  ): Promise<boolean> {
    const keys = productIds.map((id) => `product:${id}:stock`);

    // Check all stocks first, if any is lower than requested, abort entire transaction (-1).
    // Otherwise, decrement all by their specific amounts and return 1.
    const luaScript = `
      local keys = KEYS
      local args = ARGV
      
      -- Phase 1: Verification
      for i, key in ipairs(keys) do
        local currentStock = tonumber(redis.call('get', key) or 0)
        local requested = tonumber(args[i])
        if currentStock < requested then
          return -1
        end
      end
      
      -- Phase 2: Execution
      for i, key in ipairs(keys) do
        local requested = tonumber(args[i])
        redis.call('decrby', key, requested)
      end
      
      return 1
    `;

    const result = await this.client.eval(
      luaScript,
      keys.length,
      ...keys,
      ...quantities,
    );
    return result === 1;
  }
}
