import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterAssignmentViewComponent } from './cluster-assignment-view.component';

describe('ClusterAssignmentViewComponent', () => {
  let component: ClusterAssignmentViewComponent;
  let fixture: ComponentFixture<ClusterAssignmentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClusterAssignmentViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterAssignmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
