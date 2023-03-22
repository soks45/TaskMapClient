import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'prefix',
    },
    {
        path: '',
        loadComponent: () => import('@pages/auth/auth.component'),
        children: [
            {
                path: 'sign-in',
                loadComponent: () => import('@pages/auth/sign-in/sign-in.component'),
            },
            {
                path: 'sign-up',
                loadComponent: () => import('@pages/auth/sign-up/sign-up.component'),
            },
        ],
    },
];
