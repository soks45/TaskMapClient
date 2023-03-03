import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'tm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    constructor(private auth: AuthService) {}

    logout(): void {
        this.auth.logout();
    }
}
