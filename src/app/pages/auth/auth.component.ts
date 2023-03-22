import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAuthBtnComponent } from '@ui/auth/google-auth-btn/google-auth-btn.component';
import { NavTabItem, NavTabsComponent } from '@ui/nav-tabs/nav-tabs.component';
import { TaskMapComponent } from './components/task-map/task-map.component';

@Component({
    selector: 'tm-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    standalone: true,
    imports: [TaskMapComponent, NavTabsComponent, RouterOutlet, GoogleAuthBtnComponent],
})
export default class AuthComponent {
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
}
