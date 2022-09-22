import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalHttpInterceptor } from 'src/app/interceptors/global-http.iterceptor';
import { JwtInterceptor } from 'src/app/interceptors/jwt.interceptor';
import { UnauthorizedInterceptor } from 'src/app/interceptors/unauthorized.interceptor';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GlobalHttpInterceptor,
            multi: true,
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UnauthorizedInterceptor,
            multi: true,
        },
    ],
})
export class InterceptorsModule {}
