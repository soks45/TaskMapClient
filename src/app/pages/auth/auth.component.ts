import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakPointsService } from '@services/break-points.service';
import { GoogleAuthBtnComponent } from '@ui/auth/google-auth-btn/google-auth-btn.component';
import { NavTabItem, NavTabsComponent } from '@ui/nav-tabs/nav-tabs.component';
import { TaskMapComponent } from './components/task-map/task-map.component';

@Component({
    selector: 'tm-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [TaskMapComponent, NavTabsComponent, RouterOutlet, GoogleAuthBtnComponent, AsyncPipe, NgIf],
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

    constructor(public breakPointsService: BreakPointsService) {}
}
