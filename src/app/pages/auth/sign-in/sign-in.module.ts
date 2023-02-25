import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SignInFormModule } from '@ui/auth/sign-in-form/sign-in-form.module';

import { SignInRoutingModule } from 'app/pages/auth/sign-in/sign-in-routing.module';
import { SignInComponent } from 'app/pages/auth/sign-in/sign-in.component';

@NgModule({
    declarations: [SignInComponent],
    imports: [CommonModule, SignInRoutingModule, SignInFormModule],
})
export class SignInModule {}
