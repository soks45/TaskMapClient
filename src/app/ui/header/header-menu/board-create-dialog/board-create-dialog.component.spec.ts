import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardCreateDialogComponent } from './board-create-dialog.component';

describe('BoardCreateDialogComponent', () => {
  let component: BoardCreateDialogComponent;
  let fixture: ComponentFixture<BoardCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardCreateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
