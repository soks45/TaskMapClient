import { Directive, inject } from '@angular/core';
import { DestroyMixin } from '@mixins/destroy.mixin';
import { Constructor } from '@mixins/mixins';
import { AuthService } from '@services/auth.service';
import { filter, Observable, takeUntil, tap } from 'rxjs';

export function ClearCacheMixin<TBase extends Constructor>(Base: TBase) {
    @Directive()
    abstract class ClearCacheMixinClass extends DestroyMixin(Base) {
        abstract cache$: Observable<any> | undefined;
        private auth: AuthService = inject(AuthService);

        protected constructor(...args: any[]) {
            super(args);

            this.auth.user$
                .pipe(
                    takeUntil(this.destroyed$),
                    filter((u) => !u),
                    tap(() => (this.cache$ = undefined))
                )
                .subscribe();
        }
    }

    return ClearCacheMixinClass;
}
