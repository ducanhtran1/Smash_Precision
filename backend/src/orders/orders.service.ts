import { InventoryGateway } from '@/events/inventory.gateway';
import { Product } from '@/products/entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '@/users/entities/user.entity';
import { ProductsService } from '@/products/products.service';
import { UsersService } from '@/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
    constructor(
        //inject the gateway
        private readonly inventoryGateway: InventoryGateway,
        private readonly productService: ProductsService,
        private readonly userService: UsersService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) { }

    async findAll() {
        return this.orderRepository.find({ relations: ['user', 'items', 'items.product'] });
    }

    async findById(id: string) {
        return this.orderRepository.findOne({ 
            where: { id },
            relations: ['user', 'items', 'items.product']
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
        
        // Relies on TypeORM handles
        return this.orderRepository.remove(order);
    }

    async createOrder(userId: string, productIds: string[], quantities: number[]) {
        //1. Fetch product and check if stock >= quantity
        const products = await this.productService.findByIds(productIds);
        if (!products || products.length !== productIds.length) {
            throw new Error('Product not found or insufficient stock');
        }
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const newOrderItems: OrderItem[] = [];
        let totalAmount = 0;

        //2. Deduct stock and save
        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const quantity = quantities[i];
            const product = products.find(p => p.id === productId);

            if (!product || product.stock < quantity) {
                throw new Error('Product not found or insufficient stock');
            }

            await this.productService.updateStock(product.id, quantity);
            product.stock -= quantity;

            const newItemOrder = this.orderItemRepository.create({
                product: product, // relation setup
                quantity: quantity,
                priceAtPurchase: product.price * quantity,
            });
            
            const savedItem = await this.orderItemRepository.save(newItemOrder);
            newOrderItems.push(savedItem);
            totalAmount += savedItem.priceAtPurchase;

            //4. Broadcast the new stock for everyone
            this.inventoryGateway.broadcastStockUpdate(product.id, product.stock);
        }

        //3. Create the order
        const newOrder = this.orderRepository.create({
            user: user,
            items: newOrderItems,
            totalAmount: totalAmount,
            total: totalAmount,
            status: 'PENDING'
        });
        
        await this.orderRepository.save(newOrder);

        return newOrder;
    }
}
