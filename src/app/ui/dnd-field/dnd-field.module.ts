import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndFieldComponent } from './dnd-field.component';
import { TaskCardModule } from 'src/app/ui/task-card/task-card.module';
import { MatButtonModule } from "@angular/material/button";
import { DragDropModule } from "@angular/cdk/drag-drop";



@NgModule({
  declarations: [DndFieldComponent],
  exports: [DndFieldComponent], imports: [CommonModule, TaskCardModule, MatButtonModule, DragDropModule]
})
export class DndFieldModule { }
