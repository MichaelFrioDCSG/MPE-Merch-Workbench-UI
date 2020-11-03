import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@mpe/material';
import { SummaryComponent } from './summary.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from '@angular/core';

describe('LandingComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  const initialState = { Loading: false, ApplicationLoadErrors: [] };
  let store: MockStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryComponent],
      imports: [MaterialModule, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }, { provide: MatDialogRef, useValue: {} }, provideMockStore({ initialState })],
    }).compileComponents();

    httpMock = TestBed.inject<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
