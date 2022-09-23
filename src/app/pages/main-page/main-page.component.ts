import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'tm-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(private auth: AuthService) {}

    logout(): void {
        this.auth.logout();
    }
}
