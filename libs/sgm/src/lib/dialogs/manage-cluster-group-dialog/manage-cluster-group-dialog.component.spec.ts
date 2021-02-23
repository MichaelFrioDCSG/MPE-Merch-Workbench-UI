import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClusterGroupDialogComponent } from './manage-cluster-group-dialog.component';

xdescribe('ManageClusterGroupDialogComponent', () => {
  let component: ManageClusterGroupDialogComponent;
  let fixture: ComponentFixture<ManageClusterGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageClusterGroupDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClusterGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
