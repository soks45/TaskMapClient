import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { BreakPointsService } from '@services/break-points.service';
import { defaultPageRoute } from 'app/app.routes';
import { AuthedHeaderComponent } from './components/authed-header/authed-header.component';

@Component({
    selector: 'tm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, AuthedHeaderComponent, AsyncPipe, RouterLink, MatIconModule],
})
export class HeaderComponent {
    constructor(public auth: AuthService, public breakPoints: BreakPointsService) {}

    protected readonly defaultPageRoute = './' + defaultPageRoute;
}
