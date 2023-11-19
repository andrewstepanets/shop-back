import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from './CartItem';

enum STATUS {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}
@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'date', nullable: false })
  created_at: Date;

  @Column({ type: 'date', nullable: false })
  updated_at: Date;

  @Column({ type: 'text', enum: STATUS })
  status: string;

  @OneToMany(() => CartItem, (item) => item.cart)
  cart_items: CartItem[];
}
