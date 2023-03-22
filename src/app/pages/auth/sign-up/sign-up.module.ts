import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SignUpRoutingModule } from 'app/pages/auth/sign-up/sign-up-routing.module';
import { SignUpComponent } from 'app/pages/auth/sign-up/sign-up.component';

@NgModule({
    imports: [CommonModule, SignUpRoutingModule, SignUpComponent],
})
export class SignUpModule {}
