import { AuthService } from '@services/auth.service';
import { asapScheduler, Observable, scheduled } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function appInitializer(authService: AuthService): () => Observable<any> {
    return () => authService.refreshTokens().pipe(catchError(() => scheduled([], asapScheduler)));
}
