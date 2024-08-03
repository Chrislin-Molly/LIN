import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrl: './bs-navbar.component.css',
})
export class BsNavbarComponent implements OnInit, OnDestroy {
  public user!: AppUser;
  private subscription: Subscription[] = [];
  shoppingCartItemCount!: number;
  cart$!: Observable<any>;

  constructor(
    private auth: AuthService,
    private shoppingCartService: ShoppingCartService
  ) {}

  public async ngOnInit() {
    this.subscription.push(
      this.auth.appUser$.subscribe((user) => {
        if (user) {
          this.user = user;
        }
      })
    );
    this.cart$ = await this.shoppingCartService.getCart();
  }

  public ngOnDestroy(): void {
    this.subscription.forEach((x) => x.unsubscribe());
  }

  public logout() {
    this.auth.logout();
  }
}
