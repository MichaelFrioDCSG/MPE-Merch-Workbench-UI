import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDropdownFilterComponent } from './input-dropdown-filter.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InputSpinnerComponent } from '../input-spinner/input-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@mpe/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InputDropdownComponent', () => {
  let component: InputDropdownFilterComponent;
  let fixture: ComponentFixture<InputDropdownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputDropdownFilterComponent, InputSpinnerComponent],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
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
