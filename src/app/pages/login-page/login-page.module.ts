import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import { LoginPageRoutingModule } from '@pages/login-page/login-page-routing.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [LoginPageComponent],
    imports: [CommonModule, LoginPageRoutingModule, FormsModule, MatButtonModule],
})
export class LoginPageModule {}
