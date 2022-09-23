import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'tm-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
    username = '';
    password = '';

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

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
