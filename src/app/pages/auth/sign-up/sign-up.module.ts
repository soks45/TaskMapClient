import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SignUpFormModule } from '@ui/auth/sign-up-form/sign-up-form.module';

import { SignUpRoutingModule } from 'app/pages/auth/sign-up/sign-up-routing.module';
import { SignUpComponent } from 'app/pages/auth/sign-up/sign-up.component';

@NgModule({
    declarations: [SignUpComponent],
    imports: [CommonModule, SignUpRoutingModule, SignUpFormModule],
})
export class SignUpModule {}
