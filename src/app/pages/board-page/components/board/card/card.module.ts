import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from 'src/app/pages/board-page/components/board/card/card.component';

@NgModule({
    declarations: [CardComponent],
    imports: [CommonModule, MatIconModule, DragDropModule, MatDialogModule],
    exports: [CardComponent],
})
export class CardModule {}
