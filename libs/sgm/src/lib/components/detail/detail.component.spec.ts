import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';
import { MemoizedSelector } from '@ngrx/store';
import { selectSummaryDetails } from '../../store/store-group-mgmt.selectors';
import { ColDef } from '@ag-grid-community/all-modules';
import { MaterialModule } from '@mpe/material';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';

import 'ag-grid-enterprise';
import { ClusterGroupsService } from '@mpe/AsmtMgmtService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IDetailRecord } from '../../models/IDetailRecord';
// import { AllCommunityModules } from '@ag-grid-community/all-modules';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  let store: MockStore;
  let mockSelectedClusterGroupSelector: MemoizedSelector<IStoreGroupMgmtState, IDetailRecord[]>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule, AgGridModule.withComponents([DetailComponent]), MaterialModule],
      declarations: [DetailComponent],
      providers: [provideMockStore({}), { provides: ClusterGroupsService, useValue: {} }],
    }).compileComponents();

    // Setup mock ngrx store & data for the init selector
    store = TestBed.inject(MockStore);
    mockSelectedClusterGroupSelector = store.overrideSelector(selectSummaryDetails, getMockSDetailRecords());

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;

    // Run component life cycle events
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the expected number column headers', () => {
    expect(component.columnDefs.length).toEqual(24);
  });

  it('Cluster Group Column configured correctly', () => {
    const columnDef: ColDef = component.gridApi.getColumnDef('clusterGroupName');
    expect(columnDef).toBeTruthy();

    expect(columnDef.headerName).toEqual('CLUSTER GROUP');
    expect(columnDef.resizable).toEqual(true);
    expect(columnDef.editable).toBeFalsy();
    expect(columnDef.sortable).toEqual(true);
    expect(columnDef.filter).toEqual(true);
    expect(columnDef.width).toEqual(200);
  });

  it('Cluster Label Column configured correctly', () => {
    const columnDef: ColDef = component.gridApi.getColumnDef('clusterLabel');
    expect(columnDef).toBeTruthy();

    expect(columnDef.headerName).toEqual('CLUSTER LABEL');
    expect(columnDef.resizable).toEqual(true);
    expect(columnDef.editable).toEqual(true);
    expect(columnDef.sortable).toEqual(true);
    expect(columnDef.filter).toEqual(true);
    expect(columnDef.width).toEqual(200);
  });

  it('Notes Column configured correctly', () => {
    const columnDef: ColDef = component.gridApi.getColumnDef('notes');
    expect(columnDef).toBeTruthy();

    expect(columnDef.headerName).toEqual('NOTES');
    expect(columnDef.resizable).toEqual(true);
    expect(columnDef.editable).toEqual(true);
    expect(columnDef.sortable).toEqual(true);
    expect(columnDef.filter).toEqual(true);
    expect(columnDef.width).toEqual(200);
  });

  it('Cluster Column configured correctly', () => {
    const columnDef: ColDef = component.gridApi.getColumnDef('clusterName');
    expect(columnDef).toBeTruthy();

    expect(columnDef.headerName).toEqual('CLUSTER');
    expect(columnDef.resizable).toEqual(true);
    expect(columnDef.editable).toBeFalsy();
    expect(columnDef.sortable).toEqual(true);
    expect(columnDef.filter).toEqual(true);
    expect(columnDef.width).toEqual(200);
  });

  it('Cluster Column displays correctly', () => {
    const targetCellIndex = 2;
    // Test to make sure the value initializes correctly
    const startingElement = fixture.nativeElement;
    const startingElements = startingElement.querySelectorAll('.ag-cell-value');
    expect(startingElements[targetCellIndex].textContent).toEqual('DSG / TIER 1');
  });

  it('Tier Column configured correctly', () => {
    const columnDef: ColDef = component.gridApi.getColumnDef('tier');
    expect(columnDef).toBeTruthy();

    expect(columnDef.headerName).toEqual('TIER');
    expect(columnDef.resizable).toEqual(true);
    expect(columnDef.editable).toEqual(true);
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

  it('Chain Column configured correctly', () => {
    const columnDef: ColDef = component.gridApi.getColumnDef('chain');
    expect(columnDef).toBeTruthy();

    expect(columnDef.headerName).toEqual('CHAIN');
    expect(columnDef.resizable).toEqual(true);
    expect(columnDef.editable).toEqual(true);
    expect(columnDef.sortable).toEqual(true);
    expect(columnDef.filter).toEqual(true);
    expect(columnDef.width).toEqual(100);

    expect(columnDef.cellEditorParams.values).toContain('DSG');
    expect(columnDef.cellEditorParams.values).toContain('FS');
    expect(columnDef.cellEditorParams.values).toContain('GG');
  });

  it('Store Number Column configured correctly', () => {
    const columnDef: ColDef = component.gridApi.getColumnDef('storeNumber');
    expect(columnDef).toBeTruthy();

    expect(columnDef.headerName).toEqual('STORE NUMBER');
    expect(columnDef.resizable).toEqual(true);
    expect(columnDef.editable).toBeFalsy();
    expect(columnDef.sortable).toEqual(true);
    expect(columnDef.filter).toEqual(true);
    expect(columnDef.width).toEqual(250);
  });

  it('Ad Market Column configured correctly', () => {
    const columnDef: ColDef = component.gridApi.getColumnDef('adMarket');
    expect(columnDef).toBeTruthy();

    expect(columnDef.headerName).toEqual('AD MARKET');
    expect(columnDef.resizable).toEqual(true);
    expect(columnDef.editable).toBeFalsy();
    expect(columnDef.sortable).toEqual(true);
    expect(columnDef.filter).toEqual(true);
    expect(columnDef.width).toEqual(250);
  });

  it('Cluster Label Column edits correctly', () => {
    const targetCellIndex = 1;

    // Test to make sure the value initializes correctly
    const startingElement = fixture.nativeElement;
    const startingElements = startingElement.querySelectorAll('.ag-cell-value');
    expect(startingElements[targetCellIndex].textContent).toEqual('');

    // we use the API to start and stop editing - in a real e2e test we could actually double click on the cell etc
    component.gridApi.startEditingCell({
      rowIndex: 0,
      colKey: 'clusterLabel',
      charPress: 'test 123',
    });

    const cellDefs = component.gridApi.getEditingCells();
    expect(cellDefs.length).toEqual(1);
    expect(cellDefs.find(x => x.column.getId() === 'clusterLabel')).toBeTruthy();

    component.gridApi.stopEditing();

    const element = fixture.nativeElement;
    const cellElements = element.querySelectorAll('.ag-cell-value');
    expect(cellElements[targetCellIndex].textContent).toEqual('test 123');
  });

  it('Notes Column edits correctly', () => {
    const targetCellIndex = 3;

    // Test to make sure the value initializes correctly
    const startingElement = fixture.nativeElement;
    const startingElements = startingElement.querySelectorAll('.ag-cell-value');
    expect(startingElements[targetCellIndex].textContent).toEqual('');

    // we use the API to start and stop editing - in a real e2e test we could actually double click on the cell etc
    component.gridApi.startEditingCell({
      rowIndex: 0,
      colKey: 'notes',
      charPress: 'test notes 123',
    });

    const cellDefs = component.gridApi.getEditingCells();
    expect(cellDefs.length).toEqual(1);
    expect(cellDefs.find(x => x.column.getId() === 'notes')).toBeTruthy();

    component.gridApi.stopEditing();

    const element = fixture.nativeElement;
    const cellElements = element.querySelectorAll('.ag-cell-value');
    expect(cellElements[targetCellIndex].textContent).toEqual('test notes 123');
  });

  //Shelved due to potential race condition. Will re-visit.
  xit('Chain Column edits correctly', () => {
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
    const cellEditItem: any = instances[0];

    // var wrapperInstance = cellEditItem.getFrameworkComponentInstance()[0];
    // wrapperInstance.setValue('GG');

    // dropdownItems.find(item => item.textContent == 'GG').click();

    component.gridApi.stopEditing();

    // const element = fixture.nativeElement;
    // const cellElements = element.querySelectorAll('.ag-cell-value');
    // expect(cellElements[targetCellIndex].textContent).toEqual('GG');
  });

  //Shelved due to potential race condition. Will re-visit.
  xit('Teir Column edits correctly', () => {
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
    it('Row Group panel is visible', () => {
      expect(component.rowGroupPanelShow).toEqual('always');
    });

    it('Side Bar is confugured correctly', () => {
      const sideBar = component.sideBar;
      expect(sideBar).toBeTruthy();
      expect(sideBar.defaultToolPanel).toEqual('columns');
    });

    it('Side Bar columns tool panel is configured correctly', () => {
      const toolPanels: any[] = component.sideBar.toolPanels;
      expect(toolPanels).toBeTruthy();
      const columnToolBarConfig = toolPanels.find(x => x.id === 'columns');
      expect(columnToolBarConfig).toBeTruthy();
      expect(columnToolBarConfig.labelDefault).toEqual('Columns');
      expect(columnToolBarConfig.toolPanelParams.suppressRowGroups).toEqual(true);
      expect(columnToolBarConfig.toolPanelParams.suppressValues).toEqual(true);
      expect(columnToolBarConfig.toolPanelParams.suppressPivots).toEqual(true);
      expect(columnToolBarConfig.toolPanelParams.suppressPivotMode).toEqual(true);
      expect(columnToolBarConfig.toolPanelParams.suppressSideButtons).toEqual(false);
      expect(columnToolBarConfig.toolPanelParams.suppressColumnFilter).toEqual(false);
      expect(columnToolBarConfig.toolPanelParams.suppressColumnSelectAll).toEqual(true);
      expect(columnToolBarConfig.toolPanelParams.suppressColumnExpandAll).toEqual(true);
    });

    it('Side Bar filters tool panel is configured correctly', () => {
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

    it('Status bar is configured correctly', () => {
      const statusPanels: any[] = component.statusBar.statusPanels;
      const TotalAndFiltersStatusPanelConfig = statusPanels.find(x => x.statusPanel === 'agTotalAndFilteredRowCountComponent' && x.align === 'left');
      expect(TotalAndFiltersStatusPanelConfig).toBeTruthy();
      const TotalRowCountStatusPanelConfig = statusPanels.find(x => x.statusPanel === 'agTotalRowCountComponent' && x.align === 'center');
      expect(TotalRowCountStatusPanelConfig).toBeTruthy();
      const FilteredRowCountStatusPanelConfig = statusPanels.find(x => x.statusPanel === 'agFilteredRowCountComponent');
      expect(FilteredRowCountStatusPanelConfig).toBeTruthy();
      const SelectedRowCountComponentStatusPanelConfig = statusPanels.find(x => x.statusPanel === 'agSelectedRowCountComponent');
      expect(SelectedRowCountComponentStatusPanelConfig).toBeTruthy();
      const AggregationComponentStatusPanelConfig = statusPanels.find(x => x.statusPanel === 'agAggregationComponent');
      expect(AggregationComponentStatusPanelConfig).toBeTruthy();
    });
  });
});

// Data Helper methods below
function getMockSDetailRecords(): IDetailRecord[] {
  return [
    {
      clusterGroupId: '1',
      clusterId: '1',
      clusterLocationId: '1',
      clusterGroupName: 'Mens Running Footwear',
      clusterName: 'TEST CLUSTER',
      clusterLabel: '',
      tier: 'TIER 1',
      chain: 'DSG',
      storeNumber: 99,
      adMarket: 'TEST MARKET 1',
      city: '',

      climate: 'climate',
      closeDate: 'closeDate',
      demographics: 'demographics',
      districtDescription: 'districtDescription',
      medianIncome: 'medianIncome',
      numberOfEntrances: 'numberOfEntrances',
      numberOfFloors: 'numberOfFloors',
      openDate: new Date(),
      regionDescription: 'regionDescription',
      squareFeet: 999,
      state: 'PA',
      storeFormat: 'storeFormat',
      storeStructure: 'storeStructure',
      ttlRunRate: 'ttlRunRate',
      warehouseNumber: 'warehouseNumber',
    },
  ];
}
