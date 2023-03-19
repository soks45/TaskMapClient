import { AuthService } from '@services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function appInitializer(authService: AuthService): () => Observable<any> {
    return () => authService.refreshToken().pipe(catchError(() => of()));
}
