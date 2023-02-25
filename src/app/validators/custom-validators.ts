import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    static MatchValidator(source: string, target: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const sourceCtrl = control.get(source);
            const targetCtrl = control.get(target);

            const isError =
                sourceCtrl &&
                targetCtrl &&
                sourceCtrl.value !== targetCtrl.value &&
                targetCtrl.value !== null &&
                targetCtrl.value !== '';

            if (isError) {
                targetCtrl?.setErrors({ mismatch: true });
            } else {
                if (targetCtrl?.hasError('mismatch')) {
                    targetCtrl?.setErrors({ mismatch: null });
                    targetCtrl?.updateValueAndValidity();
                }
            }

            return isError ? { mismatch: true } : null;
        };
    }
}
