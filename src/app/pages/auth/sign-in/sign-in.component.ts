import { Component } from '@angular/core';
import { SignInFormComponent } from '@ui/auth/sign-in-form/sign-in-form.component';

@Component({
    selector: 'tm-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    standalone: true,
    imports: [SignInFormComponent],
})
export class SignInComponent {}
