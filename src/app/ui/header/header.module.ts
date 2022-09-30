import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoginFormModule } from '@ui/login-form/login-form.module';
import { SignUpFormModule } from '@ui/sign-up-form/sign-up-form.module';
import { HeaderComponent } from './header.component';

@NgModule({
    declarations: [HeaderComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatRippleModule,
        RouterModule,
        MatDialogModule,
        SignUpFormModule,
        LoginFormModule,
    ],
    exports: [HeaderComponent],
})
export class HeaderModule {}
