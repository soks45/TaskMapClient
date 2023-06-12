import { DestroyRef, Directive, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { filter } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[tmValidateForm]',
    standalone: true,
})
export class ValidateFormDirective implements OnInit {
    formGroup!: FormGroup;
    @Output() validatedSubmit: EventEmitter<any> = new EventEmitter<any>();

    constructor(private formGroupDirective: FormGroupDirective, private dr: DestroyRef) {}

    ngOnInit(): void {
        this.formGroup = this.formGroupDirective.form;
        this.formGroupDirective.ngSubmit
            .pipe(
                filter(this.checkForm.bind(this)),
                map(() => this.formGroup.value),
                takeUntilDestroyed(this.dr)
            )
            .subscribe((v) => this.validatedSubmit.emit(v));
    }

    private checkForm(): boolean {
        this.formGroup.updateValueAndValidity();
        this.markFormGroupTouched();

        return this.formGroup.valid;
    }

    private markFormGroupTouched(): void {
        this.formGroup.markAsTouched();
    }
}
