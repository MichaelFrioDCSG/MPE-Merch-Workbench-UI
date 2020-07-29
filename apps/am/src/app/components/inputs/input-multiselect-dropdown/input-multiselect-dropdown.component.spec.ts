import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMultiselectDropdownComponent } from './input-multiselect-dropdown.component';

describe('InputMultiselectDropdownComponent', () => {
  let component: InputMultiselectDropdownComponent;
  let fixture: ComponentFixture<InputMultiselectDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputMultiselectDropdownComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputMultiselectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
