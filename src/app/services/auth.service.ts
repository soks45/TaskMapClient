import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class AuthService {
    private timer: Subscription | null = null;
    private isAuthedSource$ = new BehaviorSubject<boolean>(false);
    private accessTokenKey = 'K@#:@UC';
    private refreshTokenKey = 'a;kldw@#)1';

    readonly isAuthed$ = this.isAuthedSource$.asObservable();

    constructor(private router: Router, private http: HttpClient) {}

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
                    this.saveTokens(x);
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
                    this.saveTokens(x);
                    this.startTokenTimer();
                    this.router.navigateByUrl(defaultPageRoute);
                })
            );
    }

    loginWithOAuth(idToken: OAuthKey): Observable<LoginResult> {
        return this.http.post<LoginResult>(`${environment.apiUrl}/account/OAuthLogin`, idToken).pipe(
            tap((x: LoginResult) => {
                this.isAuthedSource$.next(true);
                this.saveTokens(x);
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
                    this.removeTokens();
                    this.isAuthedSource$.next(false);
                    this.stopTokenTimer();
                    this.router.navigateByUrl(PageRoutes.authPageRoute);
                })
            )
            .subscribe();
    }

    refreshTokens(): Observable<LoginResult | null> {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (!refreshToken) {
            this.removeTokens();
            return of(null);
        }

        return this.http.post<LoginResult>(`${environment.apiUrl}/account/refresh-token`, { refreshToken }).pipe(
            tap((x) => {
                this.isAuthedSource$.next(true);
                this.saveTokens(x);
                this.startTokenTimer();
            })
        );
    }

    unauthorize(): void {
        this.removeTokens();
        this.isAuthedSource$.next(false);
    }

    get accessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey);
    }

    get refreshToken(): string | null {
        return localStorage.getItem(this.accessTokenKey);
    }

    private saveTokens(x: LoginResult): void {
        localStorage.setItem(this.accessTokenKey, x.accessToken);
        localStorage.setItem(this.refreshTokenKey, x.refreshToken);
    }

    private removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    private getTokenRemainingTime(): number {
        const accessToken = localStorage.getItem(this.accessTokenKey);

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
                tap(() => this.refreshTokens().subscribe())
            )
            .subscribe();
    }

    private stopTokenTimer(): void {
        this.timer?.unsubscribe();
    }
}
