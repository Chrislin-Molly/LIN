import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css',
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  categories: any;
  subscription!: Subscription;
  @Input('category') category: any;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.subscription = this.categoryService
      .getAll()
      .subscribe((c) => (this.categories = c));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
