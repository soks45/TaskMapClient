import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from 'src/app/pages/board-page/components/board/card/card.component';

@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    CardComponent
  ]
})
export class CardModule { }
