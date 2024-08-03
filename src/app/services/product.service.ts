import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private db: AngularFireDatabase) {}

  async create(product: any) {
    const productRef = await this.db.list('/products').push(product);
    if (productRef.key) {
      const updatedProduct = { ...product, key: productRef.key };
      await this.db
        .object('/products/' + productRef.key)
        .update(updatedProduct);
    }
    return productRef;
  }
  getAll() {
    return this.db.list('/products');
  }
  get(productId: any) {
    return this.db.object('/products/' + productId);
  }
  update(productId: any, product: any) {
    return this.db.object('/products/' + productId).update(product);
  }
  delete(productId: any) {
    return this.db.object('/products/' + productId).remove();
  }
}
