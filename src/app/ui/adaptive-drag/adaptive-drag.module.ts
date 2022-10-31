import { DragDropModule } from '@angular/cdk/drag-drop';
import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragViewService } from '@ui/adaptive-drag/drag-view.service';
import { AdaptiveDragComponent } from './adaptive-drag.component';

@NgModule({
    declarations: [AdaptiveDragComponent],
    imports: [CommonModule, DragDropModule, ObserversModule],
    exports: [AdaptiveDragComponent],
    providers: [DragViewService],
})
export class AdaptiveDragModule {}
