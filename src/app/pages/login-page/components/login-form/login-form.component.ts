import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject, Constructor } from '@mixins/mixins';
import { AuthService } from '@services/auth.service';
import { MessagesService } from '@services/messages.service';
import { NGXLogger } from 'ngx-logger';
import { finalize } from 'rxjs/operators';

interface LoginFormControls {
    username: string;
    password: string;
}

@Component({
    selector: 'tm-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoginFormComponent extends FormMixin<Constructor, LoginFormControls>(BaseObject) {
    isLoading = false;
    hide = true;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private logger: NGXLogger,
        private router: Router,
        private messages: MessagesService
    ) {
        super();
        this.formGroup = this.formBuilder.group({
            username: new FormControl('', {
                initialValueIsDefault: true,
                validators: [Validators.required, Validators.maxLength(255)],
            }),
            password: new FormControl('', {
                initialValueIsDefault: true,
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
                next: (value) => {
                    this.messages.success(`Welcome ${value.firstName} ${value.lastName}!`);
                    this.logger.info('login');
                    this.router.navigate(['/main-page']);
                },
                error: (error) => {
                    this.logger.error(error);
                    this.messages.error(error);
                },
            });
    }
}
