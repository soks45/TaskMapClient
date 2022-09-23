import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardComponent } from '@pages/board-page/components/board/board.component';
import { CardModule } from '@pages/board-page/components/board/card/card.module';
import { EditCardDialogModule } from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.module';

@NgModule({
    declarations: [BoardComponent],
    imports: [CommonModule, CardModule, MatDialogModule, EditCardDialogModule],
    exports: [BoardComponent],
})
export class BoardModule {}
