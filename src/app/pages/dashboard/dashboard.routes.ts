import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@pages/dashboard/dashboard.component'),
        children: [],
    },
] as Routes;
