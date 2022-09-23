import { Directive, OnDestroy } from '@angular/core';
import { Constructor } from '@mixins/mixins';
import { Observable, Subject } from 'rxjs';

export function DestroyMixin<TBase extends Constructor>(Base: TBase) {
    @Directive()
    abstract class DestroyMixinClass extends Base implements OnDestroy {
        protected destroyed$: Observable<void>;
        private destroySource = new Subject<void>();

        protected constructor(...args: any[]) {
            super(args);
            this.destroyed$ = this.destroySource.asObservable();
        }

        ngOnDestroy(): void {
            this.destroySource.next();
            this.destroySource.complete();
        }
    }

    return DestroyMixinClass;
}
