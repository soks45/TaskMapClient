import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpPageRoutingModule } from './sign-up-page-routing.module';
import { SignUpPageComponent } from './sign-up-page.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [SignUpPageComponent],
    imports: [CommonModule, SignUpPageRoutingModule, FormsModule, MatButtonModule],
})
export class SignUpPageModule {}
