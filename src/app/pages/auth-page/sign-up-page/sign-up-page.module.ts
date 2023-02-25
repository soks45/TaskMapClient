import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SignUpPageRoutingModule } from './sign-up-page-routing.module';
import { SignUpPageComponent } from './sign-up-page.component';

@NgModule({
    declarations: [SignUpPageComponent],
    imports: [CommonModule, SignUpPageRoutingModule],
})
export class SignUpPageModule {}
