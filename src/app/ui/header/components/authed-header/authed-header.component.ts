import { Component } from '@angular/core';
import { PageRoutes } from 'app/app-routing.module';

@Component({
    selector: 'tm-authed-header',
    templateUrl: './authed-header.component.html',
    styleUrls: ['./authed-header.component.scss'],
})
export class AuthedHeaderComponent {
    routes = PageRoutes;
}
