import { Injectable } from '@nestjs/common';

import { Cart } from '../models';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem, Cart as CartEntity } from '../entities';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<Cart>,
  ) {}

  findByUserId(userId: string): Promise<Cart> {
    return this.cartRepository.findOne({ where: { user_id: userId } });
  }

  createByUserId(userId: string) {
    const userCart = {
      cart_items: [],
      user_id: userId,
    };

    return this.cartRepository.save(userCart);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);
    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, cart: Cart): Promise<Cart> {
    const { id } = await this.findOrCreateByUserId(userId);

    await Promise.all(
      cart?.cart_items.map((item) =>
        this.cartItemRepository.save({ ...item, cart_id: id }),
      ),
    );

    return this.cartRepository.findOne({ where: { id } });
  }

  async removeByUserId(userId): Promise<void> {
    await this.cartRepository.delete({ user_id: userId });
  }
}
