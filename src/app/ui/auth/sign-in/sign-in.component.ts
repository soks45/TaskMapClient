import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject } from '@mixins/mixins';

interface LoginForm {
    username: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    selector: 'tm-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent extends FormMixin(BaseObject) {
    formGroup: FormGroup<LoginForm>;
    isLoading = false;
    hide = true;

    constructor(private fb: FormBuilder) {
        super();

        this.formGroup = this.fb.group<LoginForm>({
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

        /*        this.authService
                    .login(this.formGroup.get(['username'])!.value, this.formGroup.get(['password'])!.value)
                    .pipe(finalize(() => (this.isLoading = false)))
                    .subscribe({
                        next: () => this.dialogRef.close(true),
                        error: this.messages.error,
                    });*/
        this.isLoading = false;
    }
}
