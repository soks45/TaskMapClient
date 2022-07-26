import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardHeaderComponent } from './board-header.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [BoardHeaderComponent], exports: [BoardHeaderComponent], imports: [CommonModule, MatButtonModule]
})
export class BoardHeaderModule { }
