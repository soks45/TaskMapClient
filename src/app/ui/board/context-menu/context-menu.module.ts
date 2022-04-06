import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './context-menu.component';
import { MatMenuModule } from "@angular/material/menu";
import { TaskCreateDialogModule } from "src/app/ui/board/task-create-dialog/task-create-dialog.module";


@NgModule({
  declarations: [
    ContextMenuComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    TaskCreateDialogModule
  ],
  exports: [
    ContextMenuComponent
  ]
})
export class ContextMenuModule { }
