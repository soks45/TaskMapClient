import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject } from '@mixins/mixins';
import { AuthService, Credentials } from '@services/auth.service';
import { finalize } from 'rxjs/operators';

interface LoginForm {
    username: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    selector: 'tm-sign-in-form',
    templateUrl: './sign-in-form.component.html',
    styleUrls: ['./sign-in-form.component.scss'],
})
export class SignInFormComponent extends FormMixin(BaseObject) {
    formGroup: FormGroup<LoginForm>;
    isLoading = false;
    hide = true;

    constructor(private fb: FormBuilder, private authService: AuthService) {
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
        if (!this.checkForm()) {
            return;
        }

        this.isLoading = true;

        this.authService
            .login(this.formGroup.value as Credentials)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe();
    }
}
