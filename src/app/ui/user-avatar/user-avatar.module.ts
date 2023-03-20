import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserAvatarComponent } from 'app/ui/user-avatar/user-avatar.component';

@NgModule({
    declarations: [UserAvatarComponent],
    imports: [CommonModule, MatIconModule, MatButtonModule],
    exports: [UserAvatarComponent],
})
export class UserAvatarModule {}
