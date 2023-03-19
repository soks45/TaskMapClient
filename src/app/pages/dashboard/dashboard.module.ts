import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CardModule } from '@ui/board/card/card.module';
import { DashboardRoutingModule } from 'app/pages/dashboard/dashboard-routing.module';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardRoutingModule, MatButtonModule, CardModule, DragDropModule],
})
export class DashboardModule {}
