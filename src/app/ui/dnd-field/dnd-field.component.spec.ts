import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DndFieldComponent } from './dnd-field.component';

describe('DndFieldComponent', () => {
  let component: DndFieldComponent;
  let fixture: ComponentFixture<DndFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DndFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DndFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
