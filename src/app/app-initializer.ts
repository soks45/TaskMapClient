import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

export function appInitializer(authService: AuthService): () => Observable<any> {
    return () => authService.refreshToken();
}
