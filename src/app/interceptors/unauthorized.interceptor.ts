import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((err: unknown) => {
                if (!(err instanceof HttpErrorResponse)) {
                    return throwError(() => err);
                }
                if (err.status === 401) {
                    this.authService.unauthorize();
                }

                const error = (err && err.error && err.error.message) || err.statusText;
                return throwError(error);
            })
        );
    }
}
