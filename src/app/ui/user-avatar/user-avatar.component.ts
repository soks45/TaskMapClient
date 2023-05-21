import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '@services/user.service';

@Component({
    selector: 'tm-user-avatar',
    templateUrl: './user-avatar.component.html',
    styleUrls: ['./user-avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MatIconModule, AsyncPipe],
})
export class UserAvatarComponent {
    constructor(public userService: UserService) {}
}
