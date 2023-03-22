import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';
import { AuthedHeaderComponent } from './components/authed-header/authed-header.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'tm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [NgIf, AuthedHeaderComponent, AsyncPipe],
})
export class HeaderComponent {
    isAuthed$: Observable<boolean>;

    constructor(private auth: AuthService) {
        this.isAuthed$ = this.auth.isAuthed$;
    }
}
