import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SignUpFormComponent } from 'app/ui/auth/sign-up-form/sign-up-form.component';

@NgModule({
    declarations: [SignUpFormComponent],
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatInputModule],
    exports: [SignUpFormComponent],
})
export class SignUpFormModule {}
