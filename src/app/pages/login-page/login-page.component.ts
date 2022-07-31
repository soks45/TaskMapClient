import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

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
    private authService: AuthService,
    private logger: NGXLogger
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

  onLogin(): void {
    this.logger.log(this.username, this.password);
    this.logger.log(this.route.snapshot);
    if (!this.username || !this.password) {
      return;
    }
    this.authService
      .login(this.username, this.password)
      .subscribe(
        () => {
          this.router.navigate(['main-page']);
        },
        () => {
          this.router.navigate(['login-page']);
          this.loginError = true;
        }
      );
  }

  MD5log(): void {
    this.logger.log(this.password);
  }
}
