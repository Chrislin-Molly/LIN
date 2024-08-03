import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  public categories$: any;
  public product: any = { title: '', price: 0, category: '', imageUrl: '' };
  public productId: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  public ngOnInit(): void {
    this.categories$ = this.categoryService.getAll();
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.subscriptions.push(
        this.productService
          .get(this.productId)
          .valueChanges()
          .subscribe((p) => {
            if (p) {
              this.product = p;
            }
          })
      );
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public save(product: any) {
    console.log(product);
    if (this.productId) this.productService.update(this.productId, product);
    else this.productService.create(product);
    this.router.navigate(['/admin/products']);
  }
  delete() {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.productId);
    this.router.navigate(['/admin/products']);
  }
}
