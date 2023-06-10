import { AfterViewInit, DestroyRef, Directive, EventEmitter, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { BaseForm } from 'app/models/form';
import { filter } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[tmValidateForm]',
    standalone: true,
})
export class ValidateFormDirective extends BaseForm implements AfterViewInit {
    formGroup!: FormGroup;
    @Output() validatedSubmit: EventEmitter<any> = new EventEmitter<any>();

    constructor(private formGroupDirective: FormGroupDirective, private dr: DestroyRef) {
        super();
    }

    ngAfterViewInit(): void {
        this.formGroup = this.formGroupDirective.form;
        this.formGroupDirective.ngSubmit
            .pipe(
                filter(this.checkForm.bind(this)),
                map(() => this.formGroup.value),
                takeUntilDestroyed(this.dr)
            )
            .subscribe((v) => this.validatedSubmit.emit(v));
    }
}
