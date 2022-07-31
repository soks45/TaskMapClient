import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalHttpIterceptor } from 'src/app/interceptors/global-http.iterceptor';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpIterceptor,
      multi: true,
    },
  ]
})
export class InterceptorsModule { }
