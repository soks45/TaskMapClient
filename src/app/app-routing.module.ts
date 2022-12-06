import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

const routes: Routes = [
    {
        path: 'main-page',
        loadChildren: () => import('@pages/main-page/main-page.module').then((m) => m.MainPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'board-page',
        loadChildren: () => import('@pages/board-page/board-page.module').then((m) => m.BoardPageModule),
    },
    {
        path: 'not-found',
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
            relativeLinkResolution: 'legacy',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
