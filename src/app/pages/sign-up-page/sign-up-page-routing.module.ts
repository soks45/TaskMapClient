import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpPageComponent } from '@pages/sign-up-page/sign-up-page.component';

const routes: Routes = [
    {
        path: '',
        component: SignUpPageComponent,
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SignUpPageRoutingModule {}
