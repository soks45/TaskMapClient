import { FormGroup } from '@angular/forms';

export abstract class BaseForm {
    abstract formGroup: FormGroup;

    protected checkForm(): boolean {
        this.formGroup.updateValueAndValidity();
        this.markFormGroupTouched();

        return this.formGroup.valid;
    }

    protected markFormGroupTouched(): void {
        this.formGroup.markAsTouched();
    }
}
