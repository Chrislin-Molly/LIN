import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  public products: any;
  public categories: any;
  filteredProducts: { title: string; price: number; imageUrl: string }[] = [];

  category: any;
  cart: any;
  loading: boolean = true;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private shoppingCartService: ShoppingCartService
  ) {}

  async ngOnInit() {
    this.subscriptions.push(
      this.productService
        .getAll()
        .valueChanges()
        .pipe(
          switchMap((products) => {
            this.products = this.shuffleArray(products);
            return this.route.queryParamMap;
          })
        )
        .subscribe((params) => {
          this.category = params.get('category');
          this.filteredProducts = this.category
            ? this.shuffleArray(
                this.products.filter((p: any) => p.category === this.category)
              )
            : this.shuffleArray(this.products);
          this.loading = false;
        })
    );
    this.subscriptions.push(
      (await this.shoppingCartService.getCart()).subscribe((cart) => {
        this.cart = cart;
        this.loading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private shuffleArray(array: any[]): any[] {
    const specialCategories = array.filter(
      (product) =>
        product.category === 'Crafts' || product.category === 'Sculptures'
    );
    const remainingProducts = array.filter(
      (product) =>
        product.category !== 'Crafts' && product.category !== 'Sculptures'
    );
    const shuffledArray = this.fisherYatesShuffle(remainingProducts);
    return shuffledArray.concat(specialCategories);
  }

  private fisherYatesShuffle(array: any[]): any[] {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }
}
