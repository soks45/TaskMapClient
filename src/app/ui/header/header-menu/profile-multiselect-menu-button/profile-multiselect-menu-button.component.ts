import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

const loggedOptions: string[] = [
  'Logout'
]

const notLoggedOptions: string[] = [
  'Login',
  'Sign Up'
]

@Component({
  selector: 'tm-profile-multiselect-menu-button',
  templateUrl: './profile-multiselect-menu-button.component.html',
  styleUrls: ['./profile-multiselect-menu-button.component.scss']
})

export class ProfileMultiselectMenuButtonComponent /*implements OnDestroy*/ {
  /*private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  options: string[] = []
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    auth.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      if (user) {
        this.options.push(`${user.firstName} ${user.lastName}`);
        loggedOptions.forEach(value => this.options.push(value))
      } else {
        this.options = notLoggedOptions;
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  onItemSelect(option: string) {
    if (option === 'Logout') {
      this.auth.logout();
    }
    if (option === 'Login') {
      this.router.navigate(['/login-page']);
    }
    if (option === 'Sign Up') {
      this.router.navigate(['/sign-up-page']);
    }
  }*/
}
