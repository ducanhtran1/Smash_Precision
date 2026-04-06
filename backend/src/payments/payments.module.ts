import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ProductsModule } from '../products/products.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ProductsModule,
    RedisModule,
    BullModule.registerQueue({
      name: 'orders',
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
