import { Directive } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Constructor } from '@mixins/mixins';

export type ControlsOf<T extends Record<string, any>> = {
    [K in keyof T]: T[K] extends Record<any, any> ? FormGroup<ControlsOf<T[K]>> : FormControl<T[K]>;
};

export function FormMixin<TBase extends Constructor, T extends Record<string, any>>(Base: TBase) {
    @Directive()
    abstract class FormMixinClass extends Base {
        formGroup!: FormGroup<ControlsOf<T>>;

        protected constructor(...args: any[]) {
            super(args);
        }

        protected checkForm(): boolean {
            this.formGroup.updateValueAndValidity();
            this.markFormGroupTouched();

            return this.formGroup.valid;
        }

        protected markFormGroupTouched(): void {
            this.formGroup.markAsTouched();
        }
    }

    return FormMixinClass;
}
