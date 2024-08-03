import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orders$!: Observable<any>;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.orders$ = this.authService.user$.pipe(
      switchMap((user: any) => this.orderService.getOrdersByUser(user.uid))
    );
  }
}
