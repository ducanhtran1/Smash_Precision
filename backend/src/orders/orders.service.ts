import { InventoryGateway } from '@/events/inventory.gateway';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '@/users/entities/user.entity';
import { ProductsService } from '@/products/products.service';
import { UsersService } from '@/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
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

    const products = await this.productService.findByIds(productIds);
    if (!products || products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    const user: User = await this.resolveUser(dto);

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
          `Insufficient stock for product ${productId ?? ''}`,
        );
      }

      const updated = await this.productService.updateStock(
        product.id,
        quantity,
      );

      lines.push({
        productId: updated.id,
        quantity,
        unitPrice: updated.price,
        stockAfter: updated.stock,
      });
      totalAmount += updated.price * quantity;

      this.inventoryGateway.broadcastStockUpdate(product.id, updated.stock);
    }

    // Persist Order first, then OrderItems — avoids cascade / empty UPDATE bugs
    const savedOrder = await this.orderRepository.save(
      this.orderRepository.create({
        user: { id: user.id } as User,
        status: 'Order Received',
        firstName: dto.firstName,
        lastName: dto.lastName,
        street: dto.street,
        city: dto.city,
        zip: dto.zip,
        total: totalAmount,
        totalAmount,
      }),
    );

    for (const line of lines) {
      await this.orderItemRepository
        .createQueryBuilder()
        .insert()
        .into(OrderItem)
        .values({
          order: { id: savedOrder.id },
          product: { id: line.productId },
          quantity: line.quantity,
          priceAtPurchase: line.unitPrice,
        })
        .execute();
    }

    const complete = await this.findById(savedOrder.id);
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
