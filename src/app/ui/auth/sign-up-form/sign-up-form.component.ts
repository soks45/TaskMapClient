import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject } from '@mixins/mixins';
import { AuthService } from '@services/auth.service';
import { CustomValidators } from '@validators/custom-validators';
import { PageRoutes } from 'app/app-routing.module';
import { InputUser } from 'app/models/user';
import { finalize } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    selector: 'tm-sign-up-form',
    templateUrl: './sign-up-form.component.html',
    styleUrls: ['./sign-up-form.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NgIf,
        MatButtonModule,
        MatIconModule,
        RouterLink,
    ],
})
export class SignUpFormComponent extends FormMixin(BaseObject) {
    readonly loginUrl: string = '/' + PageRoutes.authPageRoute;
    isLoading = false;
    hide = true;
    formGroup: FormGroup<SignUpForm>;

    constructor(private formBuilder: FormBuilder, private authService: AuthService) {
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

    onSubmit(): void {
        if (!this.checkForm()) {
            return;
        }

        this.isLoading = true;

        const value = this.formGroup.value;
        const { firstName, lastName, username }: InputUser = value as InputUser;
        const password = value['passwords']!.passwordConfirm!;

        this.authService
            .signup(
                {
                    firstName,
                    lastName,
                    username,
                },
                password
            )
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe();
    }
}
