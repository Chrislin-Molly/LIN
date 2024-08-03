import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.subscription = this.auth.user$.subscribe((user) => {
      if (!user) return;
      this.userService.save(user);

      let returnUrl = localStorage.getItem('returnUrl');
      if (!returnUrl) return;

      localStorage.removeItem('returnUrl');
      this.router.navigateByUrl(returnUrl);
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
