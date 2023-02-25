import { Component } from '@angular/core';
import { NavTabItem } from '@ui/nav-tabs/nav-tabs.component';

@Component({
    selector: 'tm-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
    authPages: NavTabItem[] = [
        {
            link: 'sign-in',
            title: 'sign in',
        },
        {
            link: 'sign-up',
            title: 'sign up',
        },
    ];

    onGoogleAuthed($event: { idToken: string }): void {}
}
