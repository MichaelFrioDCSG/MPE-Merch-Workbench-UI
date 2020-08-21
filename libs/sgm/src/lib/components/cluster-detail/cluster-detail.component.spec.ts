import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterDetailComponent } from './cluster-detail.component';
import { SgmHeaderComponent } from '../sgm-header/sgm-header.component';
import { MaterialModule } from '@mpe/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClusterDetailComponent', () => {
  let component: ClusterDetailComponent;
  let fixture: ComponentFixture<ClusterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClusterDetailComponent, SgmHeaderComponent],
      imports: [MaterialModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
