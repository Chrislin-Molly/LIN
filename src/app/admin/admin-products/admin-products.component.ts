import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  public products: any[] = [];
  public filteredProducts!: any[];

  private subscription!: Subscription;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit(): void {
    this.subscription = this.db
      .list('/products')
      .snapshotChanges()
      .pipe(
        map((x) => {
          return x.map((product) => ({
            key: product.payload.key,
            ...(product.payload.val() as {}),
          }));
        })
      )
      .subscribe(
        (products) => (this.filteredProducts = this.products = products)
      );
  }

  filter(query: string) {
    console.log(query);
    this.filteredProducts = query
      ? this.products.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase())
        )
      : this.products;
    console.log(this.filteredProducts);
  }
  public trackItem(index: number, item: any) {
    return item.trackId;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
