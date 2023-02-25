import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TaskMapComponent } from './task-map.component';

@NgModule({
    declarations: [TaskMapComponent],
    imports: [CommonModule, MatIconModule],
    exports: [TaskMapComponent],
})
export class TaskMapModule {}
