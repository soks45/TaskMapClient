import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { environment } from '@environments/environment';
import { InterceptorsModule } from '@interceptors/interceptors.module';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { AuthService } from '@services/auth.service';
import { appInitializer } from 'app/app-initializer';
import { AppComponent } from 'app/app.component';
import { APP_ROUTES } from 'app/app.routes';
import { GlobalErrorHandler } from 'app/error-handlers/global-error-handler';
import { CookieService } from 'ngx-cookie-service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

if (environment.production) {
    enableProdMode();
}

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
        CookieService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideRouter(APP_ROUTES),
    ],
}).catch((err) => console.error(err));
