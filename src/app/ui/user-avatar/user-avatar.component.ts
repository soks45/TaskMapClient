import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserDataSource } from '@services/data-sources/user-data-source';

@Component({
    selector: 'tm-user-avatar',
    templateUrl: './user-avatar.component.html',
    styleUrls: ['./user-avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MatIconModule, AsyncPipe, NgOptimizedImage],
})
export class UserAvatarComponent {
    constructor(public userService: UserDataSource) {}
}
