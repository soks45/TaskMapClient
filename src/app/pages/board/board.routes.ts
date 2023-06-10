import { Routes } from '@angular/router';
import { BoardComponent } from '@ui/board/board.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@pages/board/board-page.component'),
        children: [
            {
                path: ':id',
                component: BoardComponent,
            },
        ],
    },
];
