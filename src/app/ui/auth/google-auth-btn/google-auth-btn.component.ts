import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
    selector: 'tm-google-auth-btn',
    templateUrl: './google-auth-btn.component.html',
    styleUrls: ['./google-auth-btn.component.scss'],
})
export class GoogleAuthBtnComponent implements OnInit {
    @Output() authed: EventEmitter<{ idToken: string }> = new EventEmitter<{ idToken: string }>();

    constructor() {}

    ngOnInit(): void {
        this.setUpGoogle();
    }

    private setUpGoogle(): void {
        // @ts-ignore
        google.accounts.id.initialize({
            client_id: environment.authClientId,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
        });

        // @ts-ignore
        google.accounts.id.renderButton(
            // @ts-ignore
            document.getElementById('google-button'),
            {
                scope: 'profile email',
                width: 200,
                height: 50,
                longtitle: true,
                theme: 'dark',
            }
        );
    }

    async handleCredentialResponse(response: { credential: string }) {
        this.authed.emit({ idToken: response.credential });
    }
}
