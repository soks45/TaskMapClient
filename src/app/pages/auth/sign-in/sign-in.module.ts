import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SignInRoutingModule } from 'app/pages/auth/sign-in/sign-in-routing.module';
import { SignInComponent } from 'app/pages/auth/sign-in/sign-in.component';

@NgModule({
    imports: [CommonModule, SignInRoutingModule, SignInComponent],
})
export class SignInModule {}
