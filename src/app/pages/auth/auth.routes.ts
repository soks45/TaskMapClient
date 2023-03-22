import { Routes } from '@angular/router';
import AuthComponent from '@pages/auth/auth.component';
import { SignInComponent } from '@pages/auth/sign-in/sign-in.component';
import { SignUpComponent } from '@pages/auth/sign-up/sign-up.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'prefix',
    },
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: 'sign-in',
                component: SignInComponent,
            },
            {
                path: 'sign-up',
                component: SignUpComponent,
            },
        ],
    },
];
