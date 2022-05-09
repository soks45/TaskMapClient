import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap, delay, finalize } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from 'src/models/user';
import { NGXLogger } from 'ngx-logger';

interface LoginResult extends User {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})

export class AuthService implements OnDestroy {
  private readonly apiUrl = `${environment.apiUrl}/api/account`;
  private timer: Subscription | null = null;
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      if (event.key === 'logout-event') {
        this.stopTokenTimer();
        this._user.next(null);
      }
      if (event.key === 'login-event') {
        this.stopTokenTimer();
        this.http.get<LoginResult>(`${this.apiUrl}/user`).subscribe((x) => {
          this._user.next({
            userId: x.userId,
            firstName: x.firstName,
            email: x.email,
            avatar: x.avatar,
            lastName: x.lastName
          });
        });
      }
    }
  }

  constructor(private router: Router, private http: HttpClient, private logger: NGXLogger) {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  login(username: string, password: string) {
    this.logger.info('--login--');
    return this.http
      .post<LoginResult>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((x) => {
          this.logger.info(x);
          this._user.next({
            userId: x.userId,
            firstName: x.firstName,
            email: x.email,
            avatar: x.avatar,
            lastName: x.lastName
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  logout() {
    this.logger.info('--logout--');
    this.http
      .post<unknown>(`${this.apiUrl}/logout`, {})
      .pipe(
        finalize(() => {
          this.clearLocalStorage();
          this._user.next(null);
          this.stopTokenTimer();
          this.router.navigate(['/login-page']);
        })
      )
      .subscribe();
  }

  refreshToken(): Observable<LoginResult | null> {
    this.logger.info('--refresh token--');
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearLocalStorage();
      return of(null);
    }

    return this.http
      .post<LoginResult>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        map((x) => {
          this._user.next({
            userId: x.userId,
            firstName: x.firstName,
            email: x.email,
            avatar: x.avatar,
            lastName: x.lastName
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  setLocalStorage(x: LoginResult) {
    localStorage.setItem('access_token', x.accessToken);
    localStorage.setItem('refresh_token', x.refreshToken);
    localStorage.setItem('login-event', 'login' + Math.random());
  }

  clearLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.setItem('logout-event', 'logout' + Math.random());
  }

  private getTokenRemainingTime() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return 0;
    }
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() - Date.now();
  }

  private startTokenTimer() {
    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        tap({
          next: () => this.refreshToken().subscribe(),
        })
      )
      .subscribe();
  }

  private stopTokenTimer() {
    this.timer?.unsubscribe();
  }
}
