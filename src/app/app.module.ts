import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InterceptorsModule } from 'src/app/interceptors/interceptors.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from 'src/app/auth/core.module';
import { HeaderModule } from 'src/app/ui/header/header.module';
import { LoggerModule, NgxLoggerLevel, NGXLogger } from 'ngx-logger';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    BrowserAnimationsModule,
    HeaderModule,
    InterceptorsModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
      serverLogLevel: NgxLoggerLevel.ERROR,
      colorScheme: ['#aaaaaa', '#bbbbbb', '#4444aa', '#333399', 'black', 'black', 'black'],
      serverLoggingUrl: environment.logUrl
    })
  ],
  providers: [NGXLogger],
  bootstrap: [AppComponent]
})
export class AppModule { }

