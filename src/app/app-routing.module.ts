import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

export enum PageRoutes {
    authPageRoute = 'auth',
    mainPageRoute = 'main',
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
        path: PageRoutes.mainPageRoute,
        loadChildren: () => import('@pages/main-page/main-page.module').then((m) => m.MainPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: PageRoutes.boardPageRoute,
        loadChildren: () => import('@pages/board-page/board-page.module').then((m) => m.BoardPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: PageRoutes.notFoundPageRoute,
        loadChildren: () => import('@pages/not-found-page/not-found-page.module').then((m) => m.NotFoundPageModule),
    },
    {
        path: '**',
        loadChildren: () => import('@pages/not-found-page/not-found-page.module').then((m) => m.NotFoundPageModule),
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
