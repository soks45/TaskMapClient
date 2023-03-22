import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@pages/not-found/not-found-page.component'),
        children: [],
    },
];
