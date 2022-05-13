import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCreateDialogComponent } from './board-create-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    BoardCreateDialogComponent
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
    BoardCreateDialogComponent
  ]
})
export class BoardCreateDialogModule { }
