import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { User } from 'src/models/user';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'tm-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent /*implements OnInit*/ {
/*  public user: User | null = null;
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.user$.subscribe(res => this.user = res);
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      // @ts-ignore
      this.currentRoute =  event.url;
    });
  }

  ngOnInit(): void {
  }

  Logout(): void {
    this.authService.logout();
  }*/
}
