import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardPageRoutingModule } from './board-page-routing.module';
import { BoardPageComponent } from './board-page.component';
import { BoardModule } from 'src/app/ui/board/board.module';


@NgModule({
  declarations: [
    BoardPageComponent
  ], imports: [CommonModule, BoardPageRoutingModule, BoardModule]
})
export class BoardPageModule { }
