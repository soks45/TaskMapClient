import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.service';
import { MessagesService } from '@services/messages.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private messages: MessagesService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((err: unknown) => {
                if (!(err instanceof HttpErrorResponse)) {
                    return throwError(() => err);
                }
                if (err.status === 403 || err.status === 401) {
                    this.authService.unauthorize();
                }

                if (!environment.production) {
                    this.messages.error(err);
                }

                const error = (err && err.error && err.error.message) || err.statusText;
                return throwError(error);
            })
        );
    }
}
