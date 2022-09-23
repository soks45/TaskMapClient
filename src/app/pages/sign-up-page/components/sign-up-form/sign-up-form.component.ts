import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormMixin } from '@mixins/form.mixin';
import { BaseObject, Constructor } from '@mixins/mixins';

interface SignUpFormControls {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

@Component({
    selector: 'tm-sign-up-form',
    templateUrl: './sign-up-form.component.html',
    styleUrls: ['./sign-up-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SignUpFormComponent extends FormMixin<Constructor, SignUpFormControls>(BaseObject) {
    constructor(private formBuilder: FormBuilder) {
        super();
        this.formGroup = this.formBuilder.group({
            firstName: new FormControl('', {
                initialValueIsDefault: true,
                validators: [Validators.required],
            }),
            lastName: new FormControl('', {
                initialValueIsDefault: true,
                validators: [Validators.required],
            }),
            email: new FormControl('', {
                initialValueIsDefault: true,
                validators: [Validators.required, Validators.email],
            }),
            password: new FormControl('', {
                initialValueIsDefault: true,
                validators: [Validators.required],
            }),
            passwordConfirm: new FormControl('', {
                initialValueIsDefault: true,
                validators: [Validators.required],
            }),
        });
    }
}
