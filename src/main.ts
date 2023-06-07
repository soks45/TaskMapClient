import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
    APP_INITIALIZER,
    DestroyRef,
    enableProdMode,
    ErrorHandler,
    importProvidersFrom,
    inject,
    InjectionToken,
} from '@angular/core';
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
import { DataSourceContext } from '@services/data-sources/base.data-source';
import { appInitializer } from 'app/app-initializer';
import { AppComponent } from 'app/app.component';
import { APP_ROUTES, PageRoutes } from 'app/app.routes';
import { GlobalErrorHandler } from 'app/error-handlers/global-error-handler';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { filter, Observable } from 'rxjs';

if (environment.production) {
    enableProdMode();
}

export const UNAUTH$_TOKEN = new InjectionToken<Observable<void>>('UNAUTH');

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            InterceptorsModule,
            LoggerModule.forRoot({
                level: NgxLoggerLevel.TRACE,
                serverLogLevel: NgxLoggerLevel.ERROR,
                colorScheme: ['#aaaaaa', '#bbbbbb', '#4444aa', '#333399', 'black', 'black', 'black'],
                serverLoggingUrl: environment.logUrl,
            }),
            MatSnackBarModule,
            LoadingBarHttpClientModule,
            LoadingBarRouterModule,
            LoadingBarModule
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [AuthService],
        },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        {
            provide: UNAUTH$_TOKEN,
            useFactory: (authService: AuthService) => authService.isAuthed$.pipe(filter((authed) => !authed)),
            deps: [AuthService],
        },
        {
            provide: DataSourceContext,
            useFactory: (resetsOn$: Observable<void>, dr: DestroyRef) => new DataSourceContext(resetsOn$, dr),
            deps: [UNAUTH$_TOKEN, DestroyRef],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideRouter(
            APP_ROUTES,
            withPreloading(PreloadAllModules),
            withComponentInputBinding(),
            withRouterConfig({ onSameUrlNavigation: 'reload', paramsInheritanceStrategy: 'always' }),
            withNavigationErrorHandler(() => inject(Router).navigate([PageRoutes.notFoundPageRoute]))
        ),
    ],
}).catch((err) => console.error(err));
