import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserAvatarComponent } from '@ui/user-avatar/user-avatar.component';
import { PageRoutes } from 'app/app.routes';

@Component({
    selector: 'tm-authed-header',
    templateUrl: './authed-header.component.html',
    styleUrls: ['./authed-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterLinkActive, RouterLink, UserAvatarComponent],
})
export class AuthedHeaderComponent {
    routes = PageRoutes;
}
