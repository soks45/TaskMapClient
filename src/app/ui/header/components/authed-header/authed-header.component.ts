import { CdkMenuTrigger } from '@angular/cdk/menu';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BreakPointsService } from '@services/break-points.service';
import { BoardsMenuComponent } from '@ui/menus/boards-menu/boards-menu.component';
import { ProfileMenuComponent } from '@ui/menus/profile-menu/profile-menu.component';
import { UserAvatarComponent } from '@ui/user-avatar/user-avatar.component';
import { PageRoutes } from 'app/app.routes';

@Component({
    selector: 'tm-authed-header',
    templateUrl: './authed-header.component.html',
    styleUrls: ['./authed-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        RouterLinkActive,
        RouterLink,
        UserAvatarComponent,
        CdkMenuTrigger,
        MatMenuModule,
        BoardsMenuComponent,
        ProfileMenuComponent,
        NgIf,
        AsyncPipe,
        MatButtonModule,
        MatIconModule,
    ],
})
export class AuthedHeaderComponent {
    routes = PageRoutes;

    constructor(public breakPointsService: BreakPointsService) {}
}
