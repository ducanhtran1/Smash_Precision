import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from '@/orders/entities/order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('float')
  price: number;

  @Column('text')
  description: string;

  @Column()
  imageUrl: string;

  @Column('json', { nullable: true })
  specs: any;

  @Column({ default: false })
  isLimited: boolean;

  @Column({ nullable: true })
  subCategory: string;

  @Column({ default: 100 })
  stock: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
