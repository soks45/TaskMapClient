import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormDialogComponent } from '@ui/header/login-form-dialog/login-form.component';

describe('LoginFormComponent', () => {
    let component: LoginFormDialogComponent;
    let fixture: ComponentFixture<LoginFormDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginFormDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
