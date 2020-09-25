import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStoreGroupDialogComponent } from './import-store-group-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@mpe/material';

describe('ImportStoreGroupDialogComponent', () => {
  let component: ImportStoreGroupDialogComponent;
  let fixture: ComponentFixture<ImportStoreGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportStoreGroupDialogComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MaterialModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportStoreGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
