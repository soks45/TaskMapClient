import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [TaskCardComponent],
  exports: [TaskCardComponent],
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class TaskCardModule { }
