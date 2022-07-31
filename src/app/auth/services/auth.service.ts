import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, Observable, of, pairwise, Subscription } from 'rxjs';
import { map, tap, delay, finalize } from 'rxjs/operators';
import { Md5 } from "md5-typescript";
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
  private readonly apiUrl = `${environment.apiUrl}/account`;
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
            lastName: x.lastName,
            lastBoardId: x.lastBoardId
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

  signup(user: User, password: string): Observable<LoginResult> {
    const userId = 0;
    const email = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const md5PasswordHash = Md5.init(password);
    return this.http
      .post<LoginResult>(`${this.apiUrl}/register`, { userId, email, firstName, lastName, md5PasswordHash })
        .pipe(
          map((x: LoginResult) => {
            this.logger.info(x);
            this._user.next({
            userId: x.userId,
            firstName: x.firstName,
            email: x.email,
            lastName: x.lastName,
            lastBoardId: x.lastBoardId
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  login(username: string, _password: string): Observable<LoginResult> {
    const password = Md5.init(_password);
    return this.http
      .post<LoginResult>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((x: LoginResult) => {
          this.logger.info(x);
          this._user.next({
            userId: x.userId,
            firstName: x.firstName,
            email: x.email,
            lastName: x.lastName,
            lastBoardId: x.lastBoardId
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  logout(): void {
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
            lastName: x.lastName,
            lastBoardId: x.lastBoardId
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  setLocalStorage(x: LoginResult): void {
    localStorage.setItem('access_token', x.accessToken);
    localStorage.setItem('refresh_token', x.refreshToken);
    localStorage.setItem('login-event', 'login' + Math.random());
  }

  clearLocalStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.setItem('logout-event', 'logout' + Math.random());
  }

  private getTokenRemainingTime(): number {
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

  private stopTokenTimer(): void {
    this.timer?.unsubscribe();
  }

  private isSameUser(user1: User | null, user2: User | null): boolean {
    console.log(user1, user2);
    if (user1 === null && user2 === null) {
      return true;
    }

    if ((user1 === null && user2 !== null) || (user2 === null && user1 !== null)) {
      return false;
    }

    return (
      // @ts-ignore
      user1.userId === user2.userId &&
      // @ts-ignore
      user1.email === user2.email &&
      // @ts-ignore
      user1.lastBoardId === user2.lastBoardId &&
      // @ts-ignore
      user1.firstName === user2.firstName &&
      // @ts-ignore
      user1.lastName === user2.lastName
    )
  }
}
