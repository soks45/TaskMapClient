import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SignUpFormModule } from '@pages/sign-up-page/components/sign-up-form/sign-up-form.module';
import { SignUpPageRoutingModule } from './sign-up-page-routing.module';
import { SignUpPageComponent } from './sign-up-page.component';

@NgModule({
    declarations: [SignUpPageComponent],
    imports: [CommonModule, SignUpPageRoutingModule, FormsModule, MatButtonModule, SignUpFormModule],
})
export class SignUpPageModule {}
