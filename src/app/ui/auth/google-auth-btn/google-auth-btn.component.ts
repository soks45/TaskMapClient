import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.service';
import { defaultPageRoute } from 'app/app.routes';

export interface OAuthKey {
    idToken: string;
}

@Component({
    selector: 'tm-google-auth-btn',
    templateUrl: './google-auth-btn.component.html',
    styleUrls: ['./google-auth-btn.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class GoogleAuthBtnComponent implements OnInit {
    constructor(private authService: AuthService, private ngZone: NgZone, private router: Router) {}

    ngOnInit(): void {
        this.setUpGoogle();
    }

    private setUpGoogle(): void {
        this.ngZone.runOutsideAngular(() => {
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
        });
    }

    handleCredentialResponse(response: { credential: string }) {
        this.authService
            .loginWithOAuth({ idToken: response.credential })
            .subscribe(() => this.ngZone.run(() => this.router.navigateByUrl(defaultPageRoute)));
    }
}
