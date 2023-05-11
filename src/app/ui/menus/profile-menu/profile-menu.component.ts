import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@services/auth.service';

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

    constructor(public authService: AuthService) {}
}
