import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDropdownFilterComponent } from './input-dropdown-filter.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { InputSpinnerComponent } from '../input-spinner/input-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InputDropdownFilterComponent', () => {
  let component: InputDropdownFilterComponent;
  let fixture: ComponentFixture<InputDropdownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputDropdownFilterComponent, InputSpinnerComponent],
      imports: [BrowserAnimationsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatProgressSpinnerModule],
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
