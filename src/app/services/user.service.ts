import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.service';
import { UploadService } from '@services/upload.service';
import { User } from 'app/models/user';
import { AsyncSubject, mergeMap, Observable, ReplaySubject, share, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private cache$?: Observable<User>;
    private user$: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(private uploadService: UploadService, private authService: AuthService, private http: HttpClient) {}

    getUser(): Observable<User> {
        return this.load().pipe(mergeMap(() => this.user$.asObservable()));
    }

    uploadAvatar(avatar: File): Observable<void> {
        const formData = new FormData();
        formData.append('avatar', avatar);

        return this.uploadService
            .upload(formData, `${environment.apiUrl}/account/upload-avatar`)
            .pipe(tap(() => this.reload()));
    }

    private reload(): void {
        this.cache$ = undefined;
        this.load().subscribe();
    }

    private load(): Observable<User> {
        if (!this.cache$) {
            this.cache$ = this.http.get<User>(`${environment.apiUrl}/account/user`, { withCredentials: true }).pipe(
                share({
                    connector: () => new AsyncSubject(),
                    resetOnError: false,
                    resetOnComplete: false,
                    resetOnRefCountZero: false,
                }),
                catchError((err: unknown) => {
                    this.cache$ = undefined;
                    throw err;
                })
            );
        }

        return this.cache$.pipe(tap((user) => this.user$.next(user)));
    }
}
