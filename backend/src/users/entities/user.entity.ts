import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '@/orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  firebaseUid: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  theme: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  units: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
