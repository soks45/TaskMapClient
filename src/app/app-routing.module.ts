import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

export enum PageRoutes {
    authPageRoute = 'auth',
    dashboardPageRoute = 'dashboard',
    boardPageRoute = 'board',
    notFoundPageRoute = 'not-found',
}

export const defaultPageRoute = PageRoutes.boardPageRoute;

const routes: Routes = [
    {
        path: '',
        redirectTo: defaultPageRoute,
        pathMatch: 'full',
    },
    {
        path: PageRoutes.authPageRoute,
        loadChildren: () => import('@pages/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: PageRoutes.dashboardPageRoute,
                loadChildren: () => import('@pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
            },
            {
                path: PageRoutes.boardPageRoute,
                loadChildren: () => import('@pages/board/board-page.module').then((m) => m.BoardPageModule),
            },
        ],
    },

    {
        path: PageRoutes.notFoundPageRoute,
        loadChildren: () => import('@pages/not-found/not-found-page.module').then((m) => m.NotFoundPageModule),
    },
    {
        path: '**',
        loadChildren: () => import('@pages/not-found/not-found-page.module').then((m) => m.NotFoundPageModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
