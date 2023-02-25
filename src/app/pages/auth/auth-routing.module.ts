import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '@pages/auth/auth.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'prefix',
    },
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: 'sign-in',
                loadChildren: () => import('@pages/auth/sign-in/sign-in.module').then((m) => m.SignInModule),
            },
            {
                path: 'sign-up',
                loadChildren: () => import('@pages/auth/sign-up/sign-up.module').then((m) => m.SignUpModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
