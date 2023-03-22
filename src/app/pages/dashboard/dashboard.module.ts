import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { DashboardRoutingModule } from 'app/pages/dashboard/dashboard-routing.module';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';

@NgModule({
    imports: [CommonModule, DashboardRoutingModule, MatButtonModule, DragDropModule, DashboardComponent],
})
export class DashboardModule {}
