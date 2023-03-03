import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DashboardRoutingModule } from 'app/pages/dashboard/dashboard-routing.module';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardRoutingModule, MatButtonModule],
})
export class DashboardModule {}
