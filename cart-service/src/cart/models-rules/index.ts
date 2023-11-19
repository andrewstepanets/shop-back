import { Cart, CartItem } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
  return cart && cart.cart_items
    ? cart.cart_items.reduce((acc: number, item: CartItem) => {
        return (acc += item.count);
      }, 0)
    : 0;
}
