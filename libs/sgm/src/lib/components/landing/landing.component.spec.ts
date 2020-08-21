import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { AgGridModule } from 'ag-grid-angular';
import { SgmHeaderComponent } from '../sgm-header/sgm-header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@mpe/material';
import { StoreGroupService } from '../../services/store-group.service';
import { MatDialog } from '@angular/material/dialog';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingComponent, SgmHeaderComponent],
      imports: [AgGridModule, RouterTestingModule, MaterialModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: StoreGroupService, useValue: { getStoreGroupHeaders: () => ({ subscribe: () => null }) } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
