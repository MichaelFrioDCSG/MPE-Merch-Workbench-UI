import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMultiselectDropdownComponent } from './input-multiselect-dropdown.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputSpinnerComponent } from '../input-spinner/input-spinner.component';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@mpe/material';

describe('InputMultiselectDropdownComponent', () => {
  let component: InputMultiselectDropdownComponent;
  let fixture: ComponentFixture<InputMultiselectDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputMultiselectDropdownComponent, InputSpinnerComponent],
      imports: [BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MaterialModule],
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
