import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user';

@Component({
    selector: 'tm-sign-up-page',
    templateUrl: './sign-up-page.component.html',
    styleUrls: ['./sign-up-page.component.scss'],
})
export class SignUpPageComponent implements OnDestroy {
    fName?: string;
    LName?: string;
    password?: string;
    password2?: string;
    email?: string;
    private subscription?: Subscription;
    private loginError: boolean = false;

    constructor(private auth: AuthService, private router: Router) {}

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    trySignUp(): void {
        if (!(this.fName && this.LName && this.password && this.email && this.password === this.password2)) {
            return;
        }
        const user: User = {
            userId: 0,
            email: this.email,
            lastName: this.LName,
            firstName: this.fName,
            lastBoardId: 0,
        };
        this.auth.signup(user, this.password).subscribe({
            next: () => {
                this.router.navigate(['main-page']);
            },
            error: () => {
                this.router.navigate(['signup']);
                this.loginError = true;
            },
        });
    }
}
