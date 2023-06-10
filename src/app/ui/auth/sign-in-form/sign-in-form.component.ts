import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ValidateFormDirective } from '@directives/validate-form.directive';
import { AuthService, Credentials } from '@services/auth.service';
import { defaultPageRoute } from 'app/app.routes';
import { finalize } from 'rxjs/operators';

interface LoginForm {
    username: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    selector: 'tm-sign-in-form',
    templateUrl: './sign-in-form.component.html',
    styleUrls: ['./sign-in-form.component.scss'],
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
        ValidateFormDirective,
    ],
})
export class SignInFormComponent {
    formGroup: FormGroup<LoginForm>;
    isLoading = false;
    hide = true;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
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

    onSubmit(value: Credentials): void {
        this.isLoading = true;

        this.authService
            .login(value)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => this.router.navigateByUrl(defaultPageRoute));
    }
}
