import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from '@pages/not-found/not-found-page.component';

const routes: Routes = [
    {
        path: '',
        component: NotFoundPageComponent,
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NotFoundPageRoutingModule {}