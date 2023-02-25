import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { InputUser, User } from '@models/user';
import { Md5 } from 'md5-typescript';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';

interface LoginResult extends User {
    accessToken: string;
    refreshToken: string;
}

export interface Credentials {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
// TODO refactor this service
export class AuthService implements OnDestroy {
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
                this.http.get<LoginResult>(`${environment.apiUrl}/account/user`).subscribe((x) => this._user.next(x));
            }
        }
    }

    constructor(private router: Router, private http: HttpClient) {
        window.addEventListener('storage', this.storageEventListener.bind(this));
    }

    ngOnDestroy(): void {
        window.removeEventListener('storage', this.storageEventListener.bind(this));
    }

    signup(user: InputUser, password: string): Observable<LoginResult> {
        const userId = 0;
        return this.http
            .post<LoginResult>(`${environment.apiUrl}/account/register`, {
                userId,
                ...user,
                password: Md5.init(password),
            })
            .pipe(
                tap((x: LoginResult) => {
                    this._user.next(x);
                    this.setLocalStorage(x);
                    this.startTokenTimer();
                })
            );
    }

    login(credentials: Credentials): Observable<LoginResult> {
        return this.http.post<LoginResult>(`${environment.apiUrl}/account/login`, <Credentials>{
            ...credentials,
            password: Md5.init(credentials.password)
        }).pipe(
            tap((x: LoginResult) => {
                this._user.next(x);
                this.setLocalStorage(x);
                this.startTokenTimer();
            })
        );
    }

    logout(): void {
        this.http
            .post<void>(`${environment.apiUrl}/account/logout`, {})
            .pipe(
                finalize(() => {
                    this.clearLocalStorage();
                    this._user.next(null);
                    this.stopTokenTimer();
                    this.router.navigate(['/board-page']);
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

        return this.http.post<LoginResult>(`${environment.apiUrl}/account/refresh-token`, { refreshToken }).pipe(
            tap((x) => {
                this._user.next(x);
                this.setLocalStorage(x);
                this.startTokenTimer();
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
                tap(() => this.refreshToken().subscribe())
            )
            .subscribe();
    }

    private stopTokenTimer(): void {
        this.timer?.unsubscribe();
    }
}
