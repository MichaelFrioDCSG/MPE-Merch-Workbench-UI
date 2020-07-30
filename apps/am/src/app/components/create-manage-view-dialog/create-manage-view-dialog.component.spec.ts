import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManageViewDialogComponent } from './create-manage-view-dialog.component';

describe('CreateManageViewDialogComponent', () => {
  let component: CreateManageViewDialogComponent;
  let fixture: ComponentFixture<CreateManageViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateManageViewDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateManageViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
