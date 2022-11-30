import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SignUpFormDialogComponent } from '@ui/header/sign-up-form-dialog/sign-up-form-dialog.component';

@NgModule({
    declarations: [SignUpFormDialogComponent],
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
    exports: [SignUpFormDialogComponent],
})
export class SignUpFormDialogModule {}
