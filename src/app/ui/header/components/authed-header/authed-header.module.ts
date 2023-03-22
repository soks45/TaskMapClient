import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { UserAvatarModule } from '@ui/user-avatar/user-avatar.module';
import { AuthedHeaderComponent } from './authed-header.component';

@NgModule({
    declarations: [AuthedHeaderComponent],
    imports: [CommonModule, RouterLinkActive, RouterLink, MatTabsModule, MatIconModule, UserAvatarModule],
    exports: [AuthedHeaderComponent],
})
export class AuthedHeaderModule {}
