import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  username = '';
  password = '';
  loginError = false;
  private subscription: Subscription | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe((x) => {
      if (true) {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (x && accessToken && refreshToken) {
          this.router.navigate(['main-page']);
        }
      } // optional touch-up: if a tab shows login page, then refresh the page to reduce duplicate login
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onLogin() {
    console.log(this.username, 1, this.password, 2);
    console.log(this.route.snapshot);
    if (!this.username || !this.password) {
      return;
    }
    const returnUrl = this.route.snapshot.queryParams['main-page'] || '';
    this.authService
        .login(this.username, this.password)
        .subscribe(
          () => {
            this.router.navigate(['main-page']);
          },
          () => {
            this.loginError = true;
          }
        );
  }
}
