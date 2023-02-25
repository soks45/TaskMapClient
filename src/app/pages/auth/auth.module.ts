import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TaskMapModule } from '@pages/auth/components/task-map/task-map.module';
import { GoogleAuthBtnModule } from '@ui/auth/google-auth-btn/google-auth-btn.module';
import { NavTabsModule } from '@ui/nav-tabs/nav-tabs.module';

import { AuthRoutingModule } from 'app/pages/auth/auth-routing.module';
import { AuthComponent } from 'app/pages/auth/auth.component';

@NgModule({
    declarations: [AuthComponent],
    imports: [CommonModule, AuthRoutingModule, TaskMapModule, NavTabsModule, GoogleAuthBtnModule],
})
export class AuthModule {}
