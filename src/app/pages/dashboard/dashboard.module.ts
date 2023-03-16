import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CardModule } from '@ui/board/card/card.module';
import { ListModule } from '@ui/list/list.module';
import { VerticalGridModule } from '@ui/vertical-grid/vertical-grid.module';
import { DashboardRoutingModule } from 'app/pages/dashboard/dashboard-routing.module';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardRoutingModule, MatButtonModule, VerticalGridModule, ListModule, CardModule],
})
export class DashboardModule {}
