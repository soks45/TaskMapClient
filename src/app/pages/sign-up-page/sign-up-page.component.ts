import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { User } from 'src/models/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tm-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent implements OnInit, OnDestroy {
  fName?: string;
  LName?: string;
  password?: string;
  password2?: string;
  email?: string;
  private subscription?: Subscription;
  private loginError: boolean = false;


  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
/*    this.subscription = this.auth.user$.subscribe((x) => {
      if (true) {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (x && accessToken && refreshToken) {
          this.router.navigate(['main-page']);
        }
      } // optional touch-up: if a tab shows login page, then refresh the page to reduce duplicate login
    });*/
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  trySignUp(): void {
    if (!(this.fName && this.LName && this.password && this.email && (this.password === this.password2))) {
      return;
    }
    const user: User = {
      userId: 0,
      email: this.email,
      lastName: this.LName,
      firstName: this.fName,
      lastBoardId: 0
    }
    this.auth.signup(user, this.password)
        .subscribe({
          next: () => {
            this.router.navigate(['main-page']);
          },
          error: () => {
            this.router.navigate(['sign-up-page']);
            this.loginError = true;
          }
        });
  }
}
