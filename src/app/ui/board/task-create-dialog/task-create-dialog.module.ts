import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCreateDialogComponent } from './task-create-dialog.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon";


@NgModule({
  declarations: [
    TaskCreateDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    TaskCreateDialogComponent
  ],
})
export class TaskCreateDialogModule { }
