import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constructor } from '@mixins/mixins';

export function FormMixin<TBase extends Constructor>(Base: TBase) {
    @Directive()
    abstract class FormMixinClass extends Base {
        abstract formGroup: FormGroup;

        abstract onSubmit(): void;

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
