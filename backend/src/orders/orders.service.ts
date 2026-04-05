import { InventoryGateway } from '@/events/inventory.gateway';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '@/users/entities/user.entity';
import { ProductsService } from '@/products/products.service';
import { Product } from '@/products/entities/product.entity';
import { UsersService } from '@/users/users.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly inventoryGateway: InventoryGateway,
    private readonly productService: ProductsService,
    private readonly userService: UsersService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async findAll() {
    return this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findById(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findByUserId(userId: string) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        userId,
      );

    return this.orderRepository.find({
      where: isUuid
        ? { user: { id: userId } }
        : { user: { firebaseUid: userId } },
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    order.status = status;
    return this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    return this.orderRepository.remove(order);
  }

  async createOrder(dto: CreateOrderDto) {
    const { productIds, quantities } = dto;
    if (!productIds?.length || !quantities?.length) {
      throw new BadRequestException('productIds and quantities are required');
    }
    if (productIds.length !== quantities.length) {
      throw new BadRequestException(
        'productIds and quantities length must match',
      );
    }

    const user: User = await this.resolveUser(dto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedOrderId: string | null = null;
    const stockUpdates: Array<{ id: string; stockAfter: number }> = [];

    try {
      // 1. Lock Product Rows (Pessimistic Write)
      const products = await queryRunner.manager
        .createQueryBuilder(Product, 'product')
        .setLock('pessimistic_write')
        .whereInIds(productIds)
        .getMany();

      if (!products || products.length !== productIds.length) {
        throw new BadRequestException('One or more products not found');
      }

      let totalAmount = 0;
      const lines: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        stockAfter: number;
      }> = [];

      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const quantity = quantities[i];
        const product = products.find((p) => p.id === productId);

        if (!product || product.stock < quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product?.name ?? 'selected item'}. Please remove it to proceed.`,
          );
        }

        // Deduct Stock
        product.stock -= quantity;
        await queryRunner.manager.save(product);

        lines.push({
          productId: product.id,
          quantity,
          unitPrice: product.price,
          stockAfter: product.stock,
        });
        totalAmount += product.price * quantity;
        stockUpdates.push({ id: product.id, stockAfter: product.stock });
      }

      // 2. Persist Order
      const savedOrder = await queryRunner.manager.save(Order, {
        user: { id: user.id } as User,
        status: 'Order Received',
        firstName: dto.firstName,
        lastName: dto.lastName,
        street: dto.street,
        city: dto.city,
        zip: dto.zip,
        total: totalAmount,
        totalAmount,
      });
      savedOrderId = savedOrder.id;

      // 3. Persist OrderItems
      for (const line of lines) {
        await queryRunner.manager.insert(OrderItem, {
          order: { id: savedOrder.id },
          product: { id: line.productId },
          quantity: line.quantity,
          priceAtPurchase: line.unitPrice,
        });
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    // Emit WebSocket updates only after successful commit
    for (const update of stockUpdates) {
      this.inventoryGateway.broadcastStockUpdate(update.id, update.stockAfter);
    }

    const complete = await this.findById(savedOrderId);
    if (!complete) {
      throw new NotFoundException('Order could not be reloaded');
    }
    return complete;
  }

  private async resolveUser(dto: CreateOrderDto): Promise<User> {
    if (dto.firebaseUid) {
      return this.userService.findOrCreateByFirebaseUid(
        dto.firebaseUid,
        dto.email ?? '',
        dto.displayName,
      );
    }
    if (dto.userId) {
      const user = await this.userService.findById(dto.userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return user;
    }
    throw new BadRequestException('Provide firebaseUid or userId');
  }
}
