import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getDashboardMetrics() {
    // Basic aggregated metrics for the admin layout
    const totalOrders = await this.orderRepository.count();
    const activeUsers = await this.userRepository.count();
    
    const { totalRevenue } = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalRevenue')
      .getRawOne();

    // Determine the top selling items by raw inventory depletion (for mock/demo purposes we just fetch randomly)
    // In a strict prod environment this would be SUM(qty) joined on order_items
    const topProductsRaw = await this.productRepository.find({ take: 3 });
    const topProducts = topProductsRaw.map((p, i) => ({
      name: p.name,
      qty: (150 - i * 30), // Mock descending quantities
      revenue: `$${((150 - i * 30) * p.price).toLocaleString()}`
    }));

    return {
      metrics: {
        totalRevenue: totalRevenue || 0,
        activeUsers,
        orderVolume: totalOrders,
        conversionRate: "3.24%" // Mock static for now
      },
      topProducts,
    };
  }
}
