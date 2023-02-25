import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TaskMapModule } from '@pages/auth-page/components/task-map/task-map.module';
import { NavTabsModule } from '@ui/nav-tabs/nav-tabs.module';

import { AuthPageRoutingModule } from './auth-page-routing.module';
import { AuthPageComponent } from './auth-page.component';

@NgModule({
    declarations: [AuthPageComponent],
    imports: [CommonModule, AuthPageRoutingModule, TaskMapModule, NavTabsModule],
})
export class AuthPageModule {}
