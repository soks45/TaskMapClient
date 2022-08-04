import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from 'src/app/pages/board-page/components/board/board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardComponent } from './card/card.component';



@NgModule({
  declarations: [
    BoardComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports: [
    BoardComponent
  ]
})
export class BoardModule { }
