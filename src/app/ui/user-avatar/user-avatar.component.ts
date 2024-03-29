import { Component } from '@angular/core';
import { UserService } from '@services/user.service';
import { User } from 'app/models/user';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'tm-user-avatar',
    templateUrl: './user-avatar.component.html',
    styleUrls: ['./user-avatar.component.scss'],
    standalone: true,
    imports: [NgIf, MatIconModule, AsyncPipe],
})
export class UserAvatarComponent {
    user$: Observable<User>;
    selectedFiles?: FileList;

    constructor(private userService: UserService) {
        this.user$ = this.userService.getUser();
    }

    selectFile($event: any) {
        this.selectedFiles = $event.target.files;

        if (this.selectedFiles && this.selectedFiles[0]) {
            this.userService.uploadAvatar(this.selectedFiles[0]).subscribe();
        }
    }
}
