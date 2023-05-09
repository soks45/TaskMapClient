import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { AuthedHeaderComponent } from './components/authed-header/authed-header.component';

@Component({
    selector: 'tm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, AuthedHeaderComponent, AsyncPipe],
})
export class HeaderComponent {
    constructor(public auth: AuthService) {}
}
