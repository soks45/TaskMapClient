import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '@services/user.service';

@Component({
    selector: 'tm-user-avatar',
    templateUrl: './user-avatar.component.html',
    styleUrls: ['./user-avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MatIconModule, AsyncPipe, NgOptimizedImage],
})
export class UserAvatarComponent {
    selectedFiles?: FileList;

    constructor(public userService: UserService) {}

    selectFile($event: any) {
        this.selectedFiles = $event.target.files;

        if (this.selectedFiles && this.selectedFiles[0]) {
            this.userService.uploadAvatar(this.selectedFiles[0]).subscribe();
        }
    }
}
