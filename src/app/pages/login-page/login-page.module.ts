import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginFormModule } from '@pages/login-page/components/login-form/login-form.module';
import { LoginPageRoutingModule } from '@pages/login-page/login-page-routing.module';
import { LoginPageComponent } from './login-page.component';

@NgModule({
    declarations: [LoginPageComponent],
    imports: [CommonModule, LoginPageRoutingModule, LoginFormModule],
})
export class LoginPageModule {}
