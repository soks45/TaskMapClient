import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';

export function appInitializer(authService: AuthService): () => Observable<any> {
    return () => authService.refreshToken();
}
