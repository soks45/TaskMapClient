import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { defaultPageRoute } from 'app/app.routes';
import { AuthedHeaderComponent } from './components/authed-header/authed-header.component';

@Component({
    selector: 'tm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, AuthedHeaderComponent, AsyncPipe, RouterLink],
})
export class HeaderComponent {
    constructor(public auth: AuthService) {}

    protected readonly defaultPageRoute = './' + defaultPageRoute;
}
