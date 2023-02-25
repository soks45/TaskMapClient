import { Component } from '@angular/core';
import { NavTabItem } from '@ui/nav-tabs/nav-tabs.component';

@Component({
    selector: 'tm-auth-page',
    templateUrl: './auth-page.component.html',
    styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent {
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
