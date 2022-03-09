import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { DndFieldModule } from 'src/app/ui/dnd-field/dnd-field.module';


@NgModule({
  declarations: [
    MainPageComponent
  ], imports: [CommonModule, MainPageRoutingModule, DndFieldModule]
})
export class MainPageModule { }
