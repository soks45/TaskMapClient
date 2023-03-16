import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CardModule } from '@ui/board/card/card.module';
import { TaskCreatorComponent } from 'app/ui/board/task-creator/task-creator.component';

@NgModule({
    declarations: [TaskCreatorComponent],
    imports: [CommonModule, CardModule, MatIconModule, MatButtonModule, MatRippleModule, DragDropModule],
    exports: [TaskCreatorComponent],
})
export class TaskCreatorModule {}
