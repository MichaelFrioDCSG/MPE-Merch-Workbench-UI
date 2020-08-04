import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryComponent } from './summary.component';
import { AgGridModule } from 'ag-grid-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '@mpe/material';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryComponent],
      imports: [AgGridModule, RouterTestingModule, HttpClientTestingModule, MaterialModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
