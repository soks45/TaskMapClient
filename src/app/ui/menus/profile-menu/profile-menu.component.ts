import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

@Component({
    selector: 'tm-profile-menu',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatMenuModule],
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./profile-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent {
    @ViewChild('profileMenu') menu!: MatMenu;
    selectedFiles?: FileList;

    constructor(public authService: AuthService, public userService: UserService) {}

    selectFile($event: any) {
        this.selectedFiles = $event.target.files;

        if (this.selectedFiles && this.selectedFiles[0]) {
            this.userService.uploadAvatar(this.selectedFiles[0]).subscribe();
        }
    }
}
