import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InterceptorsModule } from '@interceptors/interceptors.module';
import { AuthService } from '@services/auth.service';
import { HeaderModule } from '@ui/header/header.module';
import { appInitializer } from 'app/app-initializer';
import { environment } from 'environments/environment';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InterceptorsModule,
        LoggerModule.forRoot({
            level: NgxLoggerLevel.TRACE,
            serverLogLevel: NgxLoggerLevel.ERROR,
            colorScheme: ['#aaaaaa', '#bbbbbb', '#4444aa', '#333399', 'black', 'black', 'black'],
            serverLoggingUrl: environment.logUrl,
        }),
        HeaderModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [AuthService],
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
