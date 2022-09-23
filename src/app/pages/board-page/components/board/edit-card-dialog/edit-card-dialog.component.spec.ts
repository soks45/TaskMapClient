import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCardDialogComponent } from '@pages/board-page/components/board/edit-card-dialog/edit-card-dialog.component';

xdescribe('CreateCardDialogComponent', () => {
    let component: EditCardDialogComponent;
    let fixture: ComponentFixture<EditCardDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditCardDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditCardDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
