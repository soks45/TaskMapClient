import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMultiselectMenuButtonComponent } from './profile-multiselect-menu-button.component';

describe('ProfileMultiselectMenuButtonComponent', () => {
  let component: ProfileMultiselectMenuButtonComponent;
  let fixture: ComponentFixture<ProfileMultiselectMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileMultiselectMenuButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMultiselectMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
