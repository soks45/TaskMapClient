import { Component } from '@angular/core';
import { SignUpFormComponent } from '@ui/auth/sign-up-form/sign-up-form.component';

@Component({
    selector: 'tm-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    standalone: true,
    imports: [SignUpFormComponent],
})
export default class SignUpComponent {}
