import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ListComponent } from './list.component';

@NgModule({
    declarations: [ListComponent],
    exports: [ListComponent],
    imports: [CommonModule],
})
export class ListModule {}
