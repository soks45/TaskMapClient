import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { LoginFormDialogModule } from '@ui/header/login-form-dialog/login-form-dialog.module';
import { SignUpFormDialogModule } from '@ui/header/sign-up-form-dialog/sign-up-form-dialog.module';
import { HeaderComponent } from './header.component';

@NgModule({
    declarations: [HeaderComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatRippleModule,
        RouterModule,
        MatDialogModule,
        SignUpFormDialogModule,
        LoginFormDialogModule,
        MatMenuModule,
    ],
    exports: [HeaderComponent],
})
export class HeaderModule {}
