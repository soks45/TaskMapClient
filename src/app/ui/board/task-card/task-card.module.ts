import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from 'src/app/ui/board/task-card/task-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";




@NgModule({
  declarations: [TaskCardComponent],
  exports: [TaskCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    DragDropModule,
    MatIconModule
  ]
})
export class TaskCardModule { }
