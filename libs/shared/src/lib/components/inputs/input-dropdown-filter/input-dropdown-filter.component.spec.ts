import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDropdownFilterComponent } from './input-dropdown-filter.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('InputDropdownComponent', () => {
  let component: InputDropdownFilterComponent;
  let fixture: ComponentFixture<InputDropdownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputDropdownFilterComponent],
      imports: [MatAutocompleteModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDropdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
