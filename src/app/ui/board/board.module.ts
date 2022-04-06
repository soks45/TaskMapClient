import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from 'src/app/ui/board/board.component';
import { TaskCardModule } from 'src/app/ui/board/task-card/task-card.module';
import { MatButtonModule } from "@angular/material/button";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ContextMenuModule } from "src/app/ui/board/context-menu/context-menu.module";

@NgModule({
  declarations: [BoardComponent],
  exports: [BoardComponent],
  imports: [
    CommonModule,
    TaskCardModule,
    MatButtonModule,
    DragDropModule,
    ContextMenuModule,
  ]
})
export class BoardModule { }
