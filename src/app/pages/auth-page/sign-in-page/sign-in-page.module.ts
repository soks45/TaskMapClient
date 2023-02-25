import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SignInModule } from '@ui/auth/sign-in/sign-in.module';

import { SignInPageRoutingModule } from './sign-in-page-routing.module';
import { SignInPageComponent } from './sign-in-page.component';

@NgModule({
    declarations: [SignInPageComponent],
    imports: [CommonModule, SignInPageRoutingModule, SignInModule],
})
export class SignInPageModule {}
