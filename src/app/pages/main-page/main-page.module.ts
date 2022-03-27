import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { DndFieldModule } from 'src/app/ui/dnd-field/dnd-field.module';
import { TaskCardModule } from 'src/app/ui/task-card/task-card.module';

@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    DndFieldModule,
    TaskCardModule
  ]
})
export class MainPageModule { }
