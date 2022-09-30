import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BoardComponent } from '@pages/board-page/components/board/board.component';
import { CardModule } from '@pages/board-page/components/board/card/card.module';
import { EditCardDialogModule } from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.module';
import { TaskCreatorModule } from '@pages/board-page/components/board/task-creator/task-creator.module';

@NgModule({
    declarations: [BoardComponent],
    imports: [
        CommonModule,
        CardModule,
        MatDialogModule,
        EditCardDialogModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        TaskCreatorModule,
    ],
    exports: [BoardComponent],
})
export class BoardModule {}
