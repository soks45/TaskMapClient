import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { OAuthKey } from '@ui/auth/google-auth-btn/google-auth-btn.component';
import { defaultPageRoute, PageRoutes } from 'app/app-routing.module';
import { InputUser } from 'app/models/user';
import { Md5 } from 'md5-typescript';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';

interface LoginResult {
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
export class AuthService implements OnDestroy {
    private timer: Subscription | null = null;
    private isAuthedSource$ = new BehaviorSubject<boolean>(false);
    isAuthed$ = this.isAuthedSource$.asObservable();

    private storageEventListener(event: StorageEvent) {
        if (event.storageArea === localStorage) {
            if (event.key === 'logout-event') {
                this.stopTokenTimer();
                this.isAuthedSource$.next(false);
            }
            if (event.key === 'login-event') {
                this.stopTokenTimer();
                this.http
                    .get<LoginResult>(`${environment.apiUrl}/account/user`)
                    .subscribe(() => this.isAuthedSource$.next(true));
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
                    this.isAuthedSource$.next(true);
                    this.setLocalStorage(x);
                    this.startTokenTimer();
                    this.router.navigateByUrl(defaultPageRoute);
                })
            );
    }

    login(credentials: Credentials): Observable<LoginResult> {
        return this.http
            .post<LoginResult>(`${environment.apiUrl}/account/login`, <Credentials>{
                ...credentials,
                password: Md5.init(credentials.password),
            })
            .pipe(
                tap((x: LoginResult) => {
                    this.isAuthedSource$.next(true);
                    this.setLocalStorage(x);
                    this.startTokenTimer();
                    this.router.navigateByUrl(defaultPageRoute);
                })
            );
    }

    loginWithOAuth(idToken: OAuthKey): Observable<LoginResult> {
        return this.http.post<LoginResult>(`${environment.apiUrl}/account/OAuthLogin`, idToken).pipe(
            tap((x: LoginResult) => {
                this.isAuthedSource$.next(true);
                this.setLocalStorage(x);
                this.startTokenTimer();
                this.router.navigateByUrl(defaultPageRoute);
            })
        );
    }

    logout(): void {
        this.http
            .post<void>(`${environment.apiUrl}/account/logout`, {})
            .pipe(
                finalize(() => {
                    this.clearLocalStorage();
                    this.isAuthedSource$.next(false);
                    this.stopTokenTimer();
                    this.router.navigateByUrl(PageRoutes.authPageRoute);
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
                this.isAuthedSource$.next(true);
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
