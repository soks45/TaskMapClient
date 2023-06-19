import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode, ErrorHandler, importProvidersFrom, inject, isDevMode } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    PreloadAllModules,
    provideRouter,
    Router,
    withComponentInputBinding,
    withNavigationErrorHandler,
    withPreloading,
    withRouterConfig,
} from '@angular/router';
import { environment } from '@environments/environment';
import { InterceptorsModule } from '@interceptors/interceptors.module';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { AuthService } from '@services/auth.service';
import { AppComponent } from 'app/app.component';
import { APP_ROUTES, PageRoutes } from 'app/app.routes';
import { GlobalErrorHandler } from 'app/error-handlers/global-error-handler';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { asapScheduler, scheduled } from 'rxjs';
import { catchError } from 'rxjs/operators';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            InterceptorsModule,
            LoggerModule.forRoot({
                level: isDevMode() ? NgxLoggerLevel.TRACE : NgxLoggerLevel.ERROR,
                colorScheme: ['#aaaaaa', '#bbbbbb', '#4444aa', '#333399', 'black', 'black', 'black'],
            }),
            MatSnackBarModule,
            LoadingBarHttpClientModule,
            LoadingBarRouterModule,
            LoadingBarModule
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: (authService: AuthService) => () =>
                authService.refreshTokens().pipe(
                    catchError(() => {
                        authService.unauthorize();
                        return scheduled([], asapScheduler);
                    })
                ),
            multi: true,
            deps: [AuthService],
        },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideRouter(
            APP_ROUTES,
            withPreloading(PreloadAllModules),
            withComponentInputBinding(),
            withRouterConfig({ onSameUrlNavigation: 'reload' }),
            withNavigationErrorHandler(() => inject(Router).navigate([PageRoutes.notFoundPageRoute]))
        ),
    ],
}).catch((err) => console.error(err));
