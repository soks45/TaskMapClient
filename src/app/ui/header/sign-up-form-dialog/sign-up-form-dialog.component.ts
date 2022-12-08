import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject } from '@mixins/mixins';
import { AuthService } from '@services/auth.service';
import { CustomValidators } from '@validators/custom-validators';
import { NGXLogger } from 'ngx-logger';
import { finalize } from 'rxjs/operators';

interface SignUpForm {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    username: FormControl<string>;
    passwords: FormGroup<{
        password: FormControl<string>;
        passwordConfirm: FormControl<string>;
    }>;
}

@Component({
    selector: 'tm-sign-up-form-dialog',
    templateUrl: './sign-up-form-dialog.component.html',
    styleUrls: ['./sign-up-form-dialog.component.scss'],
})
export class SignUpFormDialogComponent extends FormMixin(BaseObject) {
    isLoading = false;
    hide = true;
    formGroup: FormGroup<SignUpForm>;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private logger: NGXLogger,
        private router: Router,
        private dialogRef: MatDialogRef<boolean>
    ) {
        super();
        this.formGroup = this.formBuilder.group<SignUpForm>({
            firstName: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
            lastName: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
            username: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
            passwords: new FormGroup(
                {
                    password: new FormControl('', {
                        nonNullable: true,
                        validators: [Validators.required, Validators.maxLength(255)],
                    }),
                    passwordConfirm: new FormControl('', {
                        nonNullable: true,
                        validators: [Validators.required, Validators.maxLength(255)],
                    }),
                },
                [CustomValidators.MatchValidator('password', 'passwordConfirm')]
            ),
        });
    }

    get passwordMatchError() {
        return (
            this.formGroup.get(['passwords'])!.getError('mismatch') &&
            this.formGroup.get(['passwords', 'passwordConfirm'])?.touched
        );
    }

    onSubmit(): void {
        if (!this.checkForm()) {
            return;
        }

        this.authService
            .signup(
                {
                    firstName: this.formGroup.controls.firstName.value,
                    lastName: this.formGroup.controls.lastName.value,
                    username: this.formGroup.controls.username.value,
                },
                this.formGroup.get(['passwords', 'passwordConfirm'])!.value
            )
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: () => {
                    this.dialogRef.close(true);
                    this.router.navigate(['/main-page']);
                },
                error: (error) => this.logger.error(error),
            });
    }
}
