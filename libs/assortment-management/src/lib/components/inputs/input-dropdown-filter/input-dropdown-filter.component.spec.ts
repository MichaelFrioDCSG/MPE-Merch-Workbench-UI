import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDropdownFilterComponent } from './input-dropdown-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputSpinnerComponent } from '../input-spinner/input-spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@mpe/material';

describe('InputDropdownFilterComponent', () => {
  let component: InputDropdownFilterComponent;
  let fixture: ComponentFixture<InputDropdownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputDropdownFilterComponent, InputSpinnerComponent],
      imports: [BrowserAnimationsModule, ReactiveFormsModule, MaterialModule],
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
