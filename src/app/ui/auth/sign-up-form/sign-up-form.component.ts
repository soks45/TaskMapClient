import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ValidateFormDirective } from '@directives/validate-form.directive';
import { AuthService } from '@services/auth.service';
import { CustomValidators } from '@validators/custom-validators';
import { defaultPageRoute, PageRoutes } from 'app/app.routes';
import { finalize } from 'rxjs/operators';

interface SignUpValue {
    firstName: string;
    lastName: string;
    username: string;
    passwords: {
        password: string;
        passwordConfirm: string;
    };
}

interface SignUpFormControls {
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
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        ValidateFormDirective,
    ],
})
export class SignUpFormComponent {
    readonly loginUrl: string = '/' + PageRoutes.authPageRoute;
    isLoading = false;
    hide = true;
    formGroup: FormGroup<SignUpFormControls>;

    constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
        this.formGroup = this.formBuilder.group<SignUpFormControls>({
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

    onSubmit(value: SignUpValue): void {
        this.isLoading = true;

        const { firstName, lastName, username } = value;
        const password = value.passwords.passwordConfirm;

        this.authService
            .signup({ firstName, lastName }, { username, password })
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => this.router.navigateByUrl(defaultPageRoute));
    }
}
