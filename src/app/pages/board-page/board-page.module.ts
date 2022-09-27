import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BoardModule } from '@pages/board-page/components/board/board.module';

import { BoardPageRoutingModule } from './board-page-routing.module';
import { BoardPageComponent } from './board-page.component';

@NgModule({
    declarations: [BoardPageComponent],
    imports: [CommonModule, BoardPageRoutingModule, BoardModule, MatButtonModule],
})
export class BoardPageModule {}
