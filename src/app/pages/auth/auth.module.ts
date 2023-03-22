import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from 'app/pages/auth/auth-routing.module';
import { AuthComponent } from 'app/pages/auth/auth.component';

@NgModule({
    imports: [CommonModule, AuthRoutingModule, AuthComponent],
})
export class AuthModule {}
