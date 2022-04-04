import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from 'src/app/ui/board/board.component';
import { TaskCardModule } from 'src/app/ui/board/task-card/task-card.module';
import { MatButtonModule } from "@angular/material/button";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { TaskCreateDialogModule } from "src/app/ui/board/task-create-dialog/task-create-dialog.module";

@NgModule({
  declarations: [BoardComponent],
  exports: [BoardComponent],
  imports: [
    CommonModule,
    TaskCardModule,
    MatButtonModule,
    DragDropModule,
    TaskCreateDialogModule
  ]
})
export class BoardModule { }
