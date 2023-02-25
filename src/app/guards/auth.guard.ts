import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { PageRoutes } from 'app/app-routing.module';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.user$.pipe(
            map((user) => {
                if (user) {
                    return true;
                } else {
                    this.router.navigateByUrl(PageRoutes.authPageRoute);
                    return false;
                }
            })
        );
    }
}
