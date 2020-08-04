import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOverrideDialogComponent } from './import-override-dialog.component';

describe('ImportOverrideDialogComponent', () => {
  let component: ImportOverrideDialogComponent;
  let fixture: ComponentFixture<ImportOverrideDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportOverrideDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportOverrideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
