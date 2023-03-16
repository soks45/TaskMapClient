import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AdaptiveDragModule } from '@ui/adaptive-drag/adaptive-drag.module';
import { BoardComponent } from '@ui/board/board.component';
import { CardModule } from '@ui/board/card/card.module';
import { EditCardDialogModule } from '@ui/board/edit-card-dialog/edit-card-dialog.module';
import { TaskCreatorModule } from '@ui/board/task-creator/task-creator.module';

@NgModule({
    declarations: [BoardComponent],
    imports: [CommonModule, CardModule, MatDialogModule, EditCardDialogModule, TaskCreatorModule, AdaptiveDragModule],
    exports: [BoardComponent],
})
export class BoardModule {}
