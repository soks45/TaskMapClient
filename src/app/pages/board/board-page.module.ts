import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { BoardPageRoutingModule } from '@pages/board/board-page-routing.module';
import { BoardModule } from '@pages/board/components/board/board.module';
import { BoardPageComponent } from 'app/pages/board/board-page.component';

@NgModule({
    declarations: [BoardPageComponent],
    imports: [CommonModule, BoardPageRoutingModule, BoardModule, MatButtonModule],
})
export class BoardPageModule {}