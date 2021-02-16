import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@mpe/material';
import { ClusterGroupsService } from '@mpe/AsmtMgmtService';
import { Store, select } from '@ngrx/store';
import { selectUserProfile, IUserProfile, IAuthState } from '@mpe/auth';

import { IStoreGroupMgmtState, initialState as sgmInitialState } from '../../store/store-group-mgmt.reducer';
import { initialState as authnitialstate } from 'libs/auth/src/lib/store/auth.reducers';

import { DetailComponent } from './detail.component';

import 'ag-grid-enterprise';
import { userInfo } from 'os';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let store: MockStore;
  let initialState: IAuthState = authnitialstate;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule, AgGridModule.withComponents([DetailComponent]), MaterialModule],
      declarations: [DetailComponent],
      providers: [provideMockStore({ initialState }), { provides: ClusterGroupsService, useValue: {} }],
    }).compileComponents();

    // Setup mock ngrx store & data for the init selector
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;

    component.userProfile = {
      name: null,
      roles: [],
      username: null
    };

    // Run component life cycle events
    store.refreshState();
    fixture.detectChanges();
  });

  afterEach(async () => {
    store.resetSelectors();
    fixture.destroy();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should have the expected number column headers for sgmWriteColumnDefs', async () => {
    expect(component.columnDefs.length).toEqual(26);
  });

  it('should have the expected number column headers for sgmReadColumnDefs', async () => {
    expect(component.columnDefs.length).toEqual(26);
  });

  it('Row Group panel is visible', async () => {
    expect(component.rowGroupPanelShow).toEqual('always');
  });

  it('Side Bar is confugured correctly', async () => {
    const sideBar = component.sideBar;
    expect(sideBar).toBeTruthy();
    expect(sideBar.defaultToolPanel).toEqual('columns');
  });

  it('Side Bar columns tool panel is configured correctly', async () => {
    const toolPanels: any[] = component.sideBar.toolPanels;
    expect(toolPanels).toBeTruthy();
    const columnToolBarConfig = toolPanels.find(x => x.id === 'columns');
    expect(columnToolBarConfig).toBeTruthy();
    expect(columnToolBarConfig.labelDefault).toEqual('Columns');
    expect(columnToolBarConfig.toolPanelParams.suppressRowGroups).toEqual(true);
    expect(columnToolBarConfig.toolPanelParams.suppressValues).toEqual(true);
    expect(columnToolBarConfig.toolPanelParams.suppressPivots).toEqual(true);
    expect(columnToolBarConfig.toolPanelParams.suppressPivotMode).toEqual(false);
    expect(columnToolBarConfig.toolPanelParams.suppressSideButtons).toEqual(false);
    expect(columnToolBarConfig.toolPanelParams.suppressColumnFilter).toEqual(false);
    expect(columnToolBarConfig.toolPanelParams.suppressColumnSelectAll).toEqual(true);
    expect(columnToolBarConfig.toolPanelParams.suppressColumnExpandAll).toEqual(true);
  });

  it('Side Bar filters tool panel is configured correctly', async () => {
    const toolPanels: any[] = component.sideBar.toolPanels;
    expect(toolPanels).toBeTruthy();
    const filtersToolBarConfig = toolPanels.find(x => x.id === 'filters');
    expect(filtersToolBarConfig).toBeTruthy();
    expect(filtersToolBarConfig.labelDefault).toEqual('Filters');
    expect(filtersToolBarConfig.toolPanelParams.suppressRowGroups).toEqual(true);
    expect(filtersToolBarConfig.toolPanelParams.suppressValues).toEqual(true);
    expect(filtersToolBarConfig.toolPanelParams.suppressPivots).toEqual(true);
    expect(filtersToolBarConfig.toolPanelParams.suppressPivotMode).toEqual(true);
    expect(filtersToolBarConfig.toolPanelParams.suppressSideButtons).toEqual(false);
    expect(filtersToolBarConfig.toolPanelParams.suppressColumnFilter).toEqual(false);
    expect(filtersToolBarConfig.toolPanelParams.suppressColumnSelectAll).toEqual(true);
    expect(filtersToolBarConfig.toolPanelParams.suppressColumnExpandAll).toEqual(true);
  });

  it('Cluster Group Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('clusterGroupName');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('CLUSTER GROUP');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });
  });

  it('Cluster Label Column configured correctly Editable for Admin', async () => {
    component.userProfile.roles = ['Admin'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('clusterLabel');
      expect(columnDef).toBeTruthy();
      expect(columnDef.headerName).toEqual('CLUSTER LABEL');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(true);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });
  });

  it('Cluster Label Column configured correctly Editable for SGMWrite', async () => {
    component.userProfile.roles = ['SGMWrite'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('clusterLabel');
      expect(columnDef).toBeTruthy();
      expect(columnDef.headerName).toEqual('CLUSTER LABEL');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(true);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });
  });

  it('Cluster Label Column configured correctly not Editable for non-accepted role', async () => {
    component.userProfile.roles = ['AMWrite'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('clusterLabel');
      expect(columnDef).toBeTruthy();
      expect(columnDef.headerName).toEqual('CLUSTER LABEL');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(false);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });

  });

  it('Cluster Label Column configured correctly not Editable for no role', async () => {
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('clusterLabel');
      expect(columnDef).toBeTruthy();
      expect(columnDef.headerName).toEqual('CLUSTER LABEL');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(false);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });

  });

  xit('Check Grid Options configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      expect(component.gridOptions.suppressCellSelection).toEqual(true);
    });
  });

  it('Notes Column configured correctly Editable for Admin', async () => {
    component.userProfile.roles = ['Admin'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('notes');
      expect(columnDef).toBeTruthy();
      expect(columnDef.headerName).toEqual('NOTES');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(true);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });
  });

  it('Notes Column configured correctly Editable for SGMWrite', async () => {
    component.userProfile.roles = ['SGMWrite'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('notes');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('NOTES');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(true);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });
  });

  it('Notes Column configured correctly not Editable for non-accepted role', async () => {
    component.userProfile.roles = ['AMWrite'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('notes');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('NOTES');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(false);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });
  });

  it('Notes Column configured correctly not Editable for no role', async () => {
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('notes');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('NOTES');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(false);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });
  });

  it('Cluster Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('clusterName');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('CLUSTER');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(200);
    });
  });

  // ignored for now, querySelectorAll only captures clusterGroupName and clusterLabel for some reason
  xit('Cluster Column displays correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const targetCellIndex = 2;
      // Test to make sure the value initializes correctly
      const componentElement = fixture.nativeElement;
      const cellElements = componentElement.querySelectorAll('.ag-cell-value');
      expect(cellElements[targetCellIndex].textContent).toEqual('DSG / TIER 1');
    });
  });

  it('Tier Column configured correctly Editable for Admin', async () => {
    component.userProfile.roles = ['Admin'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('tier');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('TIER');
      expect(columnDef.resizable).toEqual(true);
      expect(canBeEdited).toEqual(true);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(150);
      //John add PUR-970
      expect(columnDef.cellEditorParams.values).toContain('ECOMM');
      expect(columnDef.cellEditorParams.values).toContain('Tier 1');
      expect(columnDef.cellEditorParams.values).toContain('Tier 2');
      expect(columnDef.cellEditorParams.values).toContain('Tier 3');
      expect(columnDef.cellEditorParams.values).toContain('Tier 4');
      expect(columnDef.cellEditorParams.values).toContain('Z');
    });
  });

  it('Tier Column configured correctly Editable for SGMWrite', async () => {
    component.userProfile.roles = ['SGMWrite'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('tier');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('TIER');
      expect(columnDef.resizable).toEqual(true);
      expect(canBeEdited).toEqual(true);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(150);
      //John add PUR-970
      expect(columnDef.cellEditorParams.values).toContain('ECOMM');
      expect(columnDef.cellEditorParams.values).toContain('Tier 1');
      expect(columnDef.cellEditorParams.values).toContain('Tier 2');
      expect(columnDef.cellEditorParams.values).toContain('Tier 3');
      expect(columnDef.cellEditorParams.values).toContain('Tier 4');
      expect(columnDef.cellEditorParams.values).toContain('Z');
    });
  });

  it('Tier Column configured correctly not Editable for non-accepted role', async () => {
    component.userProfile.roles = ['AMRead'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('tier');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('TIER');
      expect(columnDef.resizable).toEqual(true);
      expect(canBeEdited).toEqual(false);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(150);
      //John add PUR-970
      expect(columnDef.cellEditorParams.values).toContain('ECOMM');
      expect(columnDef.cellEditorParams.values).toContain('Tier 1');
      expect(columnDef.cellEditorParams.values).toContain('Tier 2');
      expect(columnDef.cellEditorParams.values).toContain('Tier 3');
      expect(columnDef.cellEditorParams.values).toContain('Tier 4');
      expect(columnDef.cellEditorParams.values).toContain('Z');
    });
  });

  it('Tier Column configured correctly not Editable for no role', async () => {
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('tier');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('TIER');
      expect(columnDef.resizable).toEqual(true);
      expect(canBeEdited).toEqual(false);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(150);
      //John add PUR-970
      expect(columnDef.cellEditorParams.values).toContain('ECOMM');
      expect(columnDef.cellEditorParams.values).toContain('Tier 1');
      expect(columnDef.cellEditorParams.values).toContain('Tier 2');
      expect(columnDef.cellEditorParams.values).toContain('Tier 3');
      expect(columnDef.cellEditorParams.values).toContain('Tier 4');
      expect(columnDef.cellEditorParams.values).toContain('Z');
    });
  });

  it('Chain Column configured correctly Editable for Admin', async () => {
    component.userProfile.roles = ['Admin'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('chain');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('CHAIN');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(true);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(100);

      expect(columnDef.cellEditorParams.values).toContain('DSG');
      expect(columnDef.cellEditorParams.values).toContain('FS');
      expect(columnDef.cellEditorParams.values).toContain('GG');
    });
  });

  it('Chain Column configured correctly Editable for SGMWrite', async () => {
    component.userProfile.roles = ['SGMWrite'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('chain');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('CHAIN');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(true);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(100);

      expect(columnDef.cellEditorParams.values).toContain('DSG');
      expect(columnDef.cellEditorParams.values).toContain('FS');
      expect(columnDef.cellEditorParams.values).toContain('GG');
    });
  });

  it('Chain Column configured correctly not Editable for non-accepted role', async () => {
    component.userProfile.roles = ['AMRead'];
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('chain');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('CHAIN');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(false);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(100);

      expect(columnDef.cellEditorParams.values).toContain('DSG');
      expect(columnDef.cellEditorParams.values).toContain('FS');
      expect(columnDef.cellEditorParams.values).toContain('GG');
    });
  });

  it('Chain Column configured correctly not Editable for no role', async () => {
    let canBeEdited = component.isEditable();

    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('chain');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('CHAIN');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.sortable).toEqual(true);
      expect(canBeEdited).toEqual(false);
      expect(columnDef.editable).toBeTruthy();
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(100);

      expect(columnDef.cellEditorParams.values).toContain('DSG');
      expect(columnDef.cellEditorParams.values).toContain('FS');
      expect(columnDef.cellEditorParams.values).toContain('GG');
    });
  });

  it('Store Number Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('storeNumber');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('STORE NUMBER');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual('agSetColumnFilter');
      expect(columnDef.width).toEqual(250);
      expect(columnDef.filterParams.comparator).toBeTruthy();
    });
  });

  it('TTL Run Rate Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('ttlRunRate');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('TTL RUN RATE');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.hide).toEqual(true);
      expect(columnDef.filter).toEqual('agSetColumnFilter');
      expect(columnDef.width).toEqual(250);
      expect(columnDef.filterParams.comparator).toBeTruthy();
    });
  });
  it('Open Date Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('openDate');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('OPEN DATE');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.hide).toEqual(true);
      expect(columnDef.width).toEqual(250);
      expect(columnDef.valueGetter).toBeTruthy();
    });
  });
  it('Close Date Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('closeDate');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('CLOSE DATE');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.hide).toEqual(true);
      expect(columnDef.width).toEqual(250);
      expect(columnDef.valueGetter).toBeTruthy();
    });
  });

  it('Warehouse Number Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('warehouseNumber');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('WAREHOUSE NUMBER');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual('agSetColumnFilter');
      expect(columnDef.width).toEqual(250);
      expect(columnDef.filterParams.comparator).toBeTruthy();
    });
  });
  it('Sqaurefeet Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('squareFeet');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('SQUARE FEET');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.hide).toEqual(true);
      expect(columnDef.filter).toEqual('agSetColumnFilter');
      expect(columnDef.width).toEqual(250);
      expect(columnDef.filterParams.comparator).toBeTruthy();
    });
  });
  it('Assortment Period Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('assortmentPeriod');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('ASSORTMENT PERIOD');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.hide).toEqual(true);
      expect(columnDef.width).toEqual(250);
    });
  });
  it('Store Name Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('storeName');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('STORE NAME');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.hide).toEqual(false);
      expect(columnDef.width).toEqual(250);
    });
  });

  it('Ad Market Column configured correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const columnDef = component.agGrid.gridOptions.api.getColumnDef('adMarket');
      expect(columnDef).toBeTruthy();

      expect(columnDef.headerName).toEqual('AD MARKET');
      expect(columnDef.resizable).toEqual(true);
      expect(columnDef.editable).toBeFalsy();
      expect(columnDef.sortable).toEqual(true);
      expect(columnDef.filter).toEqual(true);
      expect(columnDef.width).toEqual(250);
    });
  });

  // ignored for now, querySelectorAll only captures clusterGroupName and clusterLabel for some reason
  xit('Cluster Label Column edits correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const targetCellIndex = 1;

      // Test to make sure the value initializes correctly
      const startingElement = fixture.nativeElement;
      const startingElements = startingElement.querySelectorAll('.ag-cell-value');
      expect(startingElements[targetCellIndex].textContent).toEqual('TEST LABEL');

      // we use the API to start and stop editing - in a real e2e test we could actually double click on the cell etc
      component.gridApi.startEditingCell({
        rowIndex: 0,
        colKey: 'clusterLabel',
        charPress: 'test 123',
      });

      const cellDefs = component.agGrid.gridOptions.api.getEditingCells();
      expect(cellDefs.length).toEqual(1);
      expect(cellDefs.find(x => x.column.getId() === 'clusterLabel')).toBeTruthy();

      component.agGrid.gridOptions.api.stopEditing();

      // Update the state
      const newState = getSGMMockState();
      newState.selectedClusterGroups[0].clusters[0].clusterLocations[0].clusterLabel = 'test 123';
      store.setState(newState);
      store.refreshState();
      fixture.detectChanges();

      // Test new state
      const element = fixture.nativeElement;
      const cellElements = element.querySelectorAll('.ag-cell-value');
      expect(cellElements[targetCellIndex].textContent).toEqual('test 123');
    });
  });

  // ignored for now, querySelectorAll only captures clusterGroupName and clusterLabel for some reason
  xit('Notes Column edits correctly', async () => {
    waitForGridApiToBeAvailable(component.agGrid.gridOptions, () => {
      const targetCellIndex = 3;

      // Test to make sure the value initializes correctly
      const startingElement = fixture.nativeElement;
      const startingElements = startingElement.querySelectorAll('.ag-cell-value');
      expect(startingElements[targetCellIndex].textContent).toEqual('');

      // we use the API to start and stop editing - in a real e2e test we could actually double click on the cell etc
      component.agGrid.gridOptions.api.startEditingCell({
        rowIndex: 0,
        colKey: 'notes',
        charPress: 'test notes 123',
      });

      const cellDefs = component.agGrid.gridOptions.api.getEditingCells();
      expect(cellDefs.length).toEqual(1);
      expect(cellDefs.find(x => x.column.getId() === 'notes')).toBeTruthy();

      component.agGrid.gridOptions.api.stopEditing();

      // Update the state
      const newState = getSGMMockState();
      newState.selectedClusterGroups[0].clusters[0].clusterLocations[0].notes = 'test notes 123';
      store.setState(newState);
      store.refreshState();
      fixture.detectChanges();

      // Test new state
      const element = fixture.nativeElement;
      const cellElements = element.querySelectorAll('.ag-cell-value');
      expect(cellElements[targetCellIndex].textContent).toEqual('test notes 123');
    });
  });

  //Shelved due to potential race condition. Will re-visit.
  xit('Chain Column edits correctly', async () => {
    const targetCellIndex = 5;

    // Test to make sure the value initializes correctly
    const startingElement = fixture.nativeElement;
    const startingElements = startingElement.querySelectorAll('.ag-cell-value');
    expect(startingElements[targetCellIndex].textContent).toEqual('DSG');

    // we use the API to start and stop editing - in a real e2e test we could actually double click on the cell etc
    component.gridApi.startEditingCell({
      rowIndex: 0,
      colKey: 'chain',
    });

    //TODO
    //wait for editor-- potential race condition

    const cellDefs = component.gridApi.getEditingCells();
    expect(cellDefs.length).toEqual(1);
    expect(cellDefs.find(x => x.column.getId() === 'chain')).toBeTruthy();

    //Grab chain from list this isn't selected chain
    const instances = component.gridApi.getCellEditorInstances();
    expect(instances.length).toEqual(1);

    component.gridApi.stopEditing();
  });

  //Shelved due to potential race condition. Will re-visit.
  xit('Teir Column edits correctly', async () => {
    const targetCellIndex = 4;
    fixture.detectChanges();
    // Test to make sure the value initializes correctly
    const startingElement = fixture.nativeElement;
    const startingElements = startingElement.querySelectorAll('.ag-cell-value');
    expect(startingElements[targetCellIndex].textContent).toEqual('TIER 1');

    // we use the API to start and stop editing - in a real e2e test we could actually double click on the cell etc
    component.gridApi.startEditingCell({
      rowIndex: 0,
      colKey: 'tier',
      charPress: 'TIER 999',
    });

    const cellDefs = component.gridApi.getEditingCells();
    expect(cellDefs.length).toEqual(1);
    expect(cellDefs.find(x => x.column.getId() === 'tier')).toBeTruthy();

    //Grab tier from list this isn't selected chain
    const dropdownItems = fixture.nativeElement.querySelectorAll('.ag-rich-select-row');
    expect(dropdownItems.length).toEqual(6);

    component.gridApi.stopEditing();

    const element = fixture.nativeElement;
    const cellElements = element.querySelectorAll('.ag-cell-value');
    expect(cellElements[targetCellIndex].textContent).toEqual('TIER 999');
  });

  it('Commit button should be disabled when no modificaions', async () => {
    // TODO: This needs to later interact with state
    component.actionsDisabled = true;
    store.refreshState();
    fixture.detectChanges();

    const btn = query('[data-test="commit-button"]');
    expect(btn.disabled).toEqual(true);
  });

  it('Revert button should be disabled when no modificaions', async () => {
    // TODO: This needs to later interact with state
    component.actionsDisabled = true;
    store.refreshState();
    fixture.detectChanges();

    const btn = query('[data-test="revert-button"]');
    expect(btn.disabled).toEqual(true);
  });

  it('Commit button should be enabled when there are modificaions', async () => {
    store.refreshState();
    fixture.detectChanges();

    const btn = query('[data-test="commit-button"]');
    expect(btn.disabled).toEqual(false);
  });

  it('Revert button should be enabled when there are modificaions', async () => {
    store.refreshState();
    fixture.detectChanges();

    const btn = query('[data-test="revert-button"]');
    expect(btn.disabled).toEqual(false);
  });

  it('Shown records should be shown correctly', async () => {
    component.shownRecords = 45;
    fixture.detectChanges();

    const span = query('[data-test="shown-records"]');
    expect(span.textContent).toEqual('45');
  });

  it('Total records should be shown correctly', async () => {
    component.totalRecords = 87;
    fixture.detectChanges();

    const span = query('[data-test="total-records"]');
    expect(span.textContent).toEqual('87');
  });

  const query = selector => fixture.debugElement.queryAll(By.css(selector))[0].nativeElement;
  const queryAll = selector => fixture.debugElement.queryAll(By.css(selector)).map(element => element.nativeElement);
});

// Data Helper methods below
function getSGMMockState(): IStoreGroupMgmtState {
  return {
    ...sgmInitialState,
    edited: false,
    selectedClusterGroups: [
      {
        clusterGroupAttributes: [],
        createdAt: null,
        createdBy: null,
        lastModifiedBy: null,
        lastModifiedOn: null,
        updatedBy: null,
        updatedOn: null,
        id: 33,
        name: 'Mens Running Footwear',
        description: 'Running',
        asmtPeriodId: 'bpdddpm0000073',
        isActive: true,
        asmtPeriod: {
          asmtPeriodId: 'bpdddpm0000073',
          asmtPeriodLabel: '2021_Wks 10-22',
          startFiscalWeekId: 202110,
          startFiscalWeek: {
            fiscalWeekId: 202110,
            weekBeginDate: new Date('2021-04-04T00:00:00'),
            weekEndDate: new Date('2021-04-10T00:00:00'),
          },
          endFiscalWeekId: 202122,
          endFiscalWeek: {
            fiscalWeekId: 202122,
            weekBeginDate: new Date('2021-06-27T00:00:00'),
            weekEndDate: new Date('2021-07-03T00:00:00'),
          },
          asmtPeriodBeginDate: new Date('2021-04-04T00:00:00'),
          asmtPeriodEndDate: new Date('2021-07-03T00:00:00'),
        },
        clusters: [
          {
            id: 11391,
            name: 'DSG_Tier 1 / PFSFW',
            tier: 'Tier 1',
            chain: 'DSG',
            clusterGroupId: 33,
            clusterLocations: [
              {
                id: 182815,
                clusterId: 11391,
                storeNumber: 1506,
                location: {
                  storeNumber: 1506,
                  storeName: 'ANNAPOLIS-MD',
                  adMarket: 'BALTIMORE',
                  regionDescription: 'Pre-Open Stores',
                  districtDescription: 'Pre-Open Stores',
                  state: 'MD',
                  openDate: new Date('2020-10-13T00:00:00'),
                  closeDate: null,
                  squareFeet: 69000,
                  warehouseNumber: '51',
                  medianIncome: null,
                  storeFormat: null,
                  ttlRunRate: null,
                  demographics: null,
                  storeStructure: null,
                  climate: 'MODERATE',
                  numberOfFloors: '2 FLOORS',
                  numberOfEntrances: '1 ENTRANCE',
                  city: 'ANNAPOLIS',
                },
                notes: 'Test Note',
                clusterLabel: 'Green Tier',
                productLocationAttributes: [],
              },
            ],
          },
        ],
      },
    ],
  };
}

function waitForGridApiToBeAvailable(gridOptions, success) {
  // recursive without a terminating condition,
  // but jasmines default test timeout will kill it (jasmine.DEFAULT_TIMEOUT_INTERVAL)

  if (gridOptions.api) {
    success();
  } else {
    setTimeout(function () {
      waitForGridApiToBeAvailable(gridOptions, success);
    }, 500);
  }
}
