import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { VerticalGridModule } from '@ui/vertical-grid/vertical-grid.module';
import { DashboardRoutingModule } from 'app/pages/dashboard/dashboard-routing.module';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardRoutingModule, MatButtonModule, VerticalGridModule],
})
export class DashboardModule {}
