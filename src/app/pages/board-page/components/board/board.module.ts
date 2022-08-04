import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from 'src/app/pages/board-page/components/board/board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardModule } from 'src/app/pages/board-page/components/board/card/card.module';



@NgModule({
  declarations: [
    BoardComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    CardModule
  ],
  exports: [
    BoardComponent
  ]
})
export class BoardModule { }
