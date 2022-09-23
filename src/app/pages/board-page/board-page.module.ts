import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardModule } from '@pages/board-page/components/board/board.module';

import { BoardPageRoutingModule } from './board-page-routing.module';
import { BoardPageComponent } from './board-page.component';

@NgModule({
    declarations: [BoardPageComponent],
    imports: [CommonModule, BoardPageRoutingModule, BoardModule],
})
export class BoardPageModule {}
