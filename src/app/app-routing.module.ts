import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

const routes: Routes = [
    {
        path: 'signup',
        loadChildren: () => import('@pages/sign-up-page/sign-up-page.module').then((m) => m.SignUpPageModule),
    }, // TODO do not allow people navigate to login and signup after authed
    {
        path: 'login',
        loadChildren: () => import('@pages/login-page/login-page.module').then((m) => m.LoginPageModule),
    },
    {
        path: 'main-page',
        loadChildren: () => import('@pages/main-page/main-page.module').then((m) => m.MainPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'board-page',
        loadChildren: () => import('@pages/board-page/board-page.module').then((m) => m.BoardPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'not-found',
        loadChildren: () => import('@pages/not-found-page/not-found-page.module').then((m) => m.NotFoundPageModule),
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
            relativeLinkResolution: 'legacy',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
