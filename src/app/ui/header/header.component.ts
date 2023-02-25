import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'tm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    isAuthed$: Observable<boolean>;

    constructor(private auth: AuthService) {
        this.isAuthed$ = this.auth.isAuthed$;
    }
}
