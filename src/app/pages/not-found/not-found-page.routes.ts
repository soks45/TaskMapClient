import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@pages/not-found/not-found-page.component';

export const routes: Routes = [
    {
        path: '',
        component: NotFoundPageComponent,
        children: [],
    },
];
