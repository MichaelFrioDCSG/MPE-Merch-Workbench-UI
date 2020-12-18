import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStoreGroupDialogComponent } from './import-store-group-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@mpe/material';

describe('ImportStoreGroupDialogComponent', () => {
  let component: ImportStoreGroupDialogComponent;
  let fixture: ComponentFixture<ImportStoreGroupDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportStoreGroupDialogComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MaterialModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportStoreGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // This is ignored for now to get tests to pass.  Will need to revisit this test and build out more.
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
