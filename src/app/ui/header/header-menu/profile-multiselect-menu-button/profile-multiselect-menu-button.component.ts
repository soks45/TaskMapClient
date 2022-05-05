import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

const loggedOptions: string[] = [
  'Profile',
  'Boards',
  'Logout'
]

const notLoggedOptions: string[] = [
  'Login'
]

@Component({
  selector: 'app-profile-multiselect-menu-button',
  templateUrl: './profile-multiselect-menu-button.component.html',
  styleUrls: ['./profile-multiselect-menu-button.component.scss']
})

export class ProfileMultiselectMenuButtonComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  options: string[] = [

  ]
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    auth.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      if (user) {
        this.options = loggedOptions;
      } else {
        this.options = notLoggedOptions;
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  ngOnInit(): void {

  }

  showMenu(): void {

  }

  onItemSelect(option: string) {
    if (option === 'Logout') {
      this.auth.logout();
    }
    if (option === 'Login') {
      this.router.navigate(['/login-page']);
    }
  }
}
