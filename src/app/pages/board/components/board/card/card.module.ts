import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '@pages/board/components/board/card/card.component';

@NgModule({
    declarations: [CardComponent],
    imports: [CommonModule, MatIconModule, DragDropModule, MatDialogModule],
    exports: [CardComponent],
})
export class CardModule {}
