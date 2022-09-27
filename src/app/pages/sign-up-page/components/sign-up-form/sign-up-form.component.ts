import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject, Constructor } from '@mixins/mixins';
import { AuthService } from '@services/auth.service';
import { CustomValidators } from '@validators/custom-validators';
import { NGXLogger } from 'ngx-logger';
import { finalize } from 'rxjs/operators';

interface SignUpFormControls {
    firstName: string;
    lastName: string;
    username: string;
    passwords: {
        password: string;
        passwordConfirm: string;
    };
}

@Component({
    selector: 'tm-sign-up-form',
    templateUrl: './sign-up-form.component.html',
    styleUrls: ['./sign-up-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SignUpFormComponent extends FormMixin<Constructor, SignUpFormControls>(BaseObject) {
    isLoading = false;
    hide = true;

    constructor(private formBuilder: FormBuilder, private authService: AuthService, private logger: NGXLogger, private router: Router) {
        super();
        this.formGroup = this.formBuilder.group({
            firstName: new FormControl('', {
                initialValueIsDefault: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
            lastName: new FormControl('', {
                initialValueIsDefault: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
            username: new FormControl('', {
                initialValueIsDefault: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
            passwords: new FormGroup(
                {
                    password: new FormControl('', {
                        initialValueIsDefault: true,
                        validators: [Validators.required, Validators.maxLength(255)],
                    }),
                    passwordConfirm: new FormControl('', {
                        initialValueIsDefault: true,
                        validators: [Validators.required, Validators.maxLength(255)],
                    }),
                },
                [CustomValidators.MatchValidator('password', 'passwordConfirm')]
            ),
        });
    }

    get passwordMatchError() {
        return this.formGroup.get(['passwords'])!.getError('mismatch') && this.formGroup.get(['passwords', 'passwordConfirm'])?.touched;
    }

    onSubmit(): void {
        if (!this.checkForm()) {
            return;
        }

        this.authService
            .signup(
                {
                    firstName: this.formGroup.get(['firstName'])!.value,
                    lastName: this.formGroup.get(['lastName'])!.value,
                    username: this.formGroup.get(['username'])!.value,
                },
                this.formGroup.get(['passwords', 'passwordConfirm'])!.value
            )
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: () => {
                    this.logger.info('authed!');
                    this.router.navigate(['/main-page']);
                },
                error: (error) => this.logger.error(error),
            });
    }
}
