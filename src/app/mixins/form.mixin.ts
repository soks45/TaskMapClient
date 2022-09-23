import { Directive } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
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

        protected validatePasswords(control: AbstractControl, name: string): ValidationErrors | null {
            if (!this.password1 || !this.password2) {
                return null;
            }
            if (this.formGroup === undefined || this.password1.value === '' || this.password2.value === '') {
                return null;
            } else if (this.password1.value === this.password2.value) {
                if (name === 'password' && this.password2.hasError('passwordMismatch')) {
                    this.password1.setErrors(null);
                    this.password2.updateValueAndValidity();
                } else if (name === 'passwordConfirm' && this.password1.hasError('passwordMismatch')) {
                    this.password2.setErrors(null);
                    this.password1.updateValueAndValidity();
                }
                return null;
            } else {
                return { passwordMismatch: { value: 'The provided passwords do not match' } };
            }
        }

        get password1(): AbstractControl | null {
            return this.formGroup.get('password');
        }

        get password2(): AbstractControl | null {
            return this.formGroup.get('passwordConfirm');
        }
    }

    return FormMixinClass;
}
