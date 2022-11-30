import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpFormDialogComponent } from '@ui/header/sign-up-form-dialog/sign-up-form.component';

describe('SignUpFormComponent', () => {
    let component: SignUpFormDialogComponent;
    let fixture: ComponentFixture<SignUpFormDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SignUpFormDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SignUpFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
