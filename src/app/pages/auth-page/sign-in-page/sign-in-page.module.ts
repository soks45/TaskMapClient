import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SignInFormModule } from '@ui/auth/sign-in/sign-in-form.module';

import { SignInPageRoutingModule } from './sign-in-page-routing.module';
import { SignInPageComponent } from './sign-in-page.component';

@NgModule({
    declarations: [SignInPageComponent],
    imports: [CommonModule, SignInPageRoutingModule, SignInFormModule],
})
export class SignInPageModule {}
