import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VerticalGridComponent } from './vertical-grid.component';

@NgModule({
    declarations: [VerticalGridComponent],
    imports: [CommonModule],
    exports: [VerticalGridComponent],
})
export class VerticalGridModule {}
