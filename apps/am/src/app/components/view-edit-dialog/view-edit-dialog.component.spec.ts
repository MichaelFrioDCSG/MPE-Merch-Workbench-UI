import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditDialogComponent } from './view-edit-dialog.component';

describe('ViewEditDialogComponent', () => {
  let component: ViewEditDialogComponent;
  let fixture: ComponentFixture<ViewEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEditDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
