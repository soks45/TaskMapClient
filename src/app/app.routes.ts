import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { tap } from 'rxjs';

export enum PageRoutes {
    authPageRoute = 'auth',
    dashboardPageRoute = 'dashboard',
    boardPageRoute = 'board',
    notFoundPageRoute = 'not-found',
}

export const defaultPageRoute = PageRoutes.boardPageRoute;

export const APP_ROUTES: Routes = [
    {
        path: '',
        redirectTo: defaultPageRoute,
        pathMatch: 'full',
    },
    {
        path: PageRoutes.authPageRoute,
        loadChildren: () => import('@pages/auth/auth.routes').then((m) => m.routes),
    },
    {
        path: '',
        canActivate: [
            () => {
                const router = inject(Router);

                return inject(AuthService).isAuthed$.pipe(
                    tap((isAuthed) => {
                        if (!isAuthed) {
                            router.navigateByUrl(PageRoutes.authPageRoute);
                        }
                    })
                );
            },
        ],
        children: [
            {
                path: PageRoutes.dashboardPageRoute,
                loadChildren: () => import('@pages/dashboard/dashboard.routes').then((m) => m.routes),
            },
            {
                path: PageRoutes.boardPageRoute,
                loadChildren: () => import('@pages/board/board.routes').then((m) => m.routes),
            },
        ],
    },
    {
        path: PageRoutes.notFoundPageRoute,
        loadChildren: () => import('@pages/not-found/not-found-page.routes').then((m) => m.routes),
    },
    {
        path: '**',
        loadChildren: () => import('@pages/not-found/not-found-page.routes').then((m) => m.routes),
    },
];
