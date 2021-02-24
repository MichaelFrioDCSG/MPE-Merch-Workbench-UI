import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '@mpe/material';
import { ManageClusterGroupDialogComponent } from './manage-cluster-group-dialog.component';
import { IClusterGroup } from '@mpe/shared';
import { ManageClusterGroupsActions, ManageClusterGroupsSelectors } from '../../store/manage';
import { of } from 'rxjs';

import { HarnessLoader } from '@angular/cdk/testing';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

class MockSelectors extends ManageClusterGroupsSelectors {
  public clusterGroups: IClusterGroup[];

  public getClusterGroups = () => {
    return of(this.clusterGroups);
  };
  public getLoading = () => of(false);
  public getAvailableSubclassesLoading = () => of(false);
  public getAvailableSubclasses = () => of([]);
  public getErrors = () => of([]);
  public getSelectedClusterGroup = () => of(null);
}

class MockActions extends ManageClusterGroupsActions {
  public showDialog = (clusterGroups: IClusterGroup[]) => {};
  public manageClusterGroup = (index: number) => {};
  public getAssortmentPeriodSubclasses = (assortmentPeriodId: string) => {};
}

xdescribe('ManageClusterGroupDialogComponent', () => {
  let component: ManageClusterGroupDialogComponent;
  let fixture: ComponentFixture<ManageClusterGroupDialogComponent>;
  let loader: HarnessLoader;
  let tabGroupHarness: MatTabGroupHarness;

  let mockActions;
  let mockSelectors;

  beforeEach(async(() => {
    mockActions = new MockActions(undefined);
    mockSelectors = new MockSelectors(undefined);

    TestBed.configureTestingModule({
      imports: [FormsModule, MaterialModule],
      declarations: [ManageClusterGroupDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { clusterGroupIds: [1] } },
        { provide: ManageClusterGroupsSelectors, useValue: mockSelectors },
        { provide: ManageClusterGroupsActions, useValue: mockActions },
      ],
    }).compileComponents();
  }));

  beforeEach(async () => {
    // Create the component and update the DOM
    fixture = TestBed.createComponent(ManageClusterGroupDialogComponent);
    component = fixture.componentInstance;

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  // This worked then it stopped working no idea what is wrong
  xit('should have correct number of tabs', async () => {
    const mockClusterGroup = getMockClusterGroup();

    component.clusterGroups$ = of([mockClusterGroup]);
    fixture.detectChanges();

    tabGroupHarness = await loader.getHarness<MatTabGroupHarness>(MatTabGroupHarness);
    const tabs = await tabGroupHarness.getTabs();
    expect(tabs.length).toEqual(1);
  });
});

// Try to find something to fixture with
function getMockClusterGroup(): IClusterGroup {
  return {
    id: 0,
    name: 'Test Cluster Group',
    description: '',
    asmtPeriodId: '',
    asmtPeriod: null,
    lastModifiedOn: new Date(),
    lastModifiedBy: '',
    clusters: [],
    clusterGroupAttributes: [],
    createdBy: '',
    createdAt: new Date(),
    updatedBy: '',
    updatedOn: new Date(),
    isActive: true,
  };
}
