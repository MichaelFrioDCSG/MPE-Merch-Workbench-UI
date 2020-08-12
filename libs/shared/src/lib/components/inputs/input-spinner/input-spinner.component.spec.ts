import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSpinnerComponent } from './input-spinner.component';
import { CommonModule } from '@angular/common';

describe('InputSpinnerComponent', () => {
  let component: InputSpinnerComponent;
  let fixture: ComponentFixture<InputSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
