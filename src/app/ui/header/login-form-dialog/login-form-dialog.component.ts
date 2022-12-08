import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject } from '@mixins/mixins';
import { AuthService } from '@services/auth.service';
import { MessagesService } from '@services/messages.service';
import { finalize } from 'rxjs/operators';

interface LoginForm {
    username: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    selector: 'tm-login-form-dialog',
    templateUrl: './login-form-dialog.component.html',
    styleUrls: ['./login-form-dialog.component.scss'],
})
export class LoginFormDialogComponent extends FormMixin(BaseObject) {
    isLoading = false;
    hide = true;
    formGroup: FormGroup<LoginForm>;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private messages: MessagesService,
        private dialogRef: MatDialogRef<boolean>
    ) {
        super();
        this.formGroup = this.formBuilder.group({
            username: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
            password: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
        });
    }

    onSubmit(): void {
        if (!this.checkForm) {
            return;
        }

        this.isLoading = true;

        this.authService
            .login(this.formGroup.get(['username'])!.value, this.formGroup.get(['password'])!.value)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: () => this.dialogRef.close(true),
                error: this.messages.error,
            });
    }
}
