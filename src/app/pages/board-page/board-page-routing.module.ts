import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardPageComponent } from 'src/app/pages/board-page/board-page.component';

const routes: Routes = [
    {
        path: '',
        component: BoardPageComponent,
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BoardPageRoutingModule {}
