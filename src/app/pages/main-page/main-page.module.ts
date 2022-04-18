import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { BoardModule } from 'src/app/ui/board/board.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    BoardModule,
    MatButtonModule
  ]
})
export class MainPageModule { }
