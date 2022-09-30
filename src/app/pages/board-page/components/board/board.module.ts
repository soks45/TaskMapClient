import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BoardComponent } from '@pages/board-page/components/board/board.component';
import { CardModule } from '@pages/board-page/components/board/card/card.module';
import { EditCardDialogModule } from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.module';

@NgModule({
    declarations: [BoardComponent],
    imports: [CommonModule, CardModule, MatDialogModule, EditCardDialogModule, MatProgressBarModule],
    exports: [BoardComponent],
})
export class BoardModule {}
