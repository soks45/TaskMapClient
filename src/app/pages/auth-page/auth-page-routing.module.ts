import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageComponent } from '@pages/auth-page/auth-page.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'prefix',
    },
    {
        path: '',
        component: AuthPageComponent,
        children: [
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('@pages/auth-page/sign-in-page/sign-in-page.module').then((m) => m.SignInPageModule),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('@pages/auth-page/sign-up-page/sign-up-page.module').then((m) => m.SignUpPageModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthPageRoutingModule {}
