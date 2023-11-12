import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Cart } from './Cart';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', primary: true, name: 'product_id' })
  product_id: string;

  @Column({ type: 'int' })
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.cart_items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
