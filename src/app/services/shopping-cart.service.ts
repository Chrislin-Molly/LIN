import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Product } from '../models/product';
import { map, take } from 'rxjs/operators';
import { ShoppingCart } from '../models/shopping-cart';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime(),
    });
  }

  async getCart() {
    let cartId = await this.getOrCreateCartId();

    return this.db
      .object('/shopping-carts/' + cartId)
      .valueChanges()
      .pipe(map((x: any) => new ShoppingCart(x.items)));
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    let result = await this.create();
    if (result.key) localStorage.setItem('cartId', result.key);
    return result.key;
  }

  async addToCart(product: any) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.db.object(
      '/shopping-carts/' + cartId + '/items/' + product.key
    );

    item$
      .snapshotChanges()
      .pipe(take(1))
      .subscribe((action: any) => {
        const item = action.payload.val();
        if (item) {
          item$.update({ quantity: item.quantity + 1 });
        } else {
          item$.set({ product: product, quantity: 1 });
        }
      });
  }

  async removeFromCart(product: any) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.db.object(
      '/shopping-carts/' + cartId + '/items/' + product.key
    );

    item$
      .snapshotChanges()
      .pipe(take(1))
      .subscribe((action: any) => {
        const item = action.payload.val();
        if (item) {
          const newQuantity = item.quantity - 1;
          if (newQuantity > 0) {
            item$.update({ quantity: newQuantity });
          } else {
            item$.remove();
          }
        }
      });
  }
  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }
  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }
}
