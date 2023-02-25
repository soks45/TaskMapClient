import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SignUpFormModule } from '@ui/auth/sign-up/sign-up-form.module';

import { SignUpPageRoutingModule } from './sign-up-page-routing.module';
import { SignUpPageComponent } from './sign-up-page.component';

@NgModule({
    declarations: [SignUpPageComponent],
    imports: [CommonModule, SignUpPageRoutingModule, SignUpFormModule],
})
export class SignUpPageModule {}
