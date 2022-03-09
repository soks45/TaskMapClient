import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndFieldComponent } from './dnd-field.component';
import { TaskCardModule } from 'src/app/ui/task-card/task-card.module';



@NgModule({
  declarations: [DndFieldComponent],
  exports: [DndFieldComponent],
  imports: [
    CommonModule,
    TaskCardModule
  ]
})
export class DndFieldModule { }
