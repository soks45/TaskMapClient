import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'tm-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
    username = '';
    password = '';

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private logger: NGXLogger) {}

    onLogin(): void {
        if (!this.username || !this.password) {
            return;
        }
        this.authService.login(this.username, this.password).subscribe(
            () => {
                this.router.navigate(['main-page']);
            },
            () => {
                this.router.navigate(['login']);
            }
        );
    }
}
