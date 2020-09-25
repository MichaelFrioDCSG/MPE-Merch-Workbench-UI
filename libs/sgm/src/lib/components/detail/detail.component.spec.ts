import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { IToolPanel, ToolPanelDef } from '@ag-grid-community/all-modules';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  const initialState = { Loading: false, ApplicationLoadErrors: [] };
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
