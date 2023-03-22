import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundPageRoutingModule } from './not-found-page-routing.module';
import { NotFoundPageComponent } from './not-found-page.component';

@NgModule({
    imports: [CommonModule, NotFoundPageRoutingModule, NotFoundPageComponent],
})
export class NotFoundPageModule {}
