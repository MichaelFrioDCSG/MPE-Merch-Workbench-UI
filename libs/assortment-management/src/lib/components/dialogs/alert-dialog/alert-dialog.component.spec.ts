import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogComponent } from './alert-dialog.component';
import { MaterialModule } from '@mpe/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('AlertDialogComponent', () => {
  let component: AlertDialogComponent;
  let fixture: ComponentFixture<AlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertDialogComponent],
      imports: [MaterialModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { updateSize: (width: string, height: string) => {} } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
