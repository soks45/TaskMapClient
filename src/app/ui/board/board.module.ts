import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AdaptiveDragModule } from '@ui/adaptive-drag/adaptive-drag.module';
import { BoardComponent } from '@ui/board/board.component';

@NgModule({
    imports: [CommonModule, MatDialogModule, AdaptiveDragModule, BoardComponent],
    exports: [BoardComponent],
})
export class BoardModule {}
