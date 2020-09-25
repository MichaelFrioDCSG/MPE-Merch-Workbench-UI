import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

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
    const sideBar = component.gridApi.getSideBar();
    expect(sideBar).toBeTruthy();
    expect(sideBar.defaultToolPanel).toEqual('columns');
  });

  it('Side Bar columns tool panel is configured correctly', ()=> {
    const toolPanels: any[] = component.sideBar.toolPanels;
    const columnToolBarConfig = toolPanels.find(x => x.id === 'columns');
    expect(columnToolBarConfig).toBeTruthy();
    expect(columnToolBarConfig.labelDefault).toEqual('Columns');
    expect(columnToolBarConfig.suppressRowGroups).toEqual('true');
    expect(columnToolBarConfig.suppressValues).toEqual('true');
    expect(columnToolBarConfig.suppressPivots).toEqual('true');
    expect(columnToolBarConfig.suppressPivotMode).toEqual('true');
    expect(columnToolBarConfig.suppressSideButtons).toEqual('false');
    expect(columnToolBarConfig.suppressColumnFilter).toEqual('false');
    expect(columnToolBarConfig.suppressColumnSelectAll).toEqual('true');
    expect(columnToolBarConfig.suppressColumnExpandAll).toEqual('true');
  });

  it('Side Bar filters tool panel is configured correctly', ()=> {
    const toolPanels: any[] = component.sideBar.toolPanels;
    const filtersToolBarConfig = toolPanels.find(x => x.id === 'filters');
    expect(filtersToolBarConfig).toBeTruthy();
    expect(filtersToolBarConfig.labelDefault).toEqual('Filters');
    expect(filtersToolBarConfig.suppressRowGroups).toEqual('true');
    expect(filtersToolBarConfig.suppressValues).toEqual('true');
    expect(filtersToolBarConfig.suppressPivots).toEqual('true');
    expect(filtersToolBarConfig.suppressPivotMode).toEqual('true');
    expect(filtersToolBarConfig.suppressSideButtons).toEqual('false');
    expect(filtersToolBarConfig.suppressColumnFilter).toEqual('false');
    expect(filtersToolBarConfig.suppressColumnSelectAll).toEqual('true');
    expect(filtersToolBarConfig.suppressColumnExpandAll).toEqual('true');
  });

  it('Status bar is configured correctly', () => {
    const statusBar: any [] = component.statusBar;
    const TotalAndFiltersStatusPanelConfig = statusBar.find(x => x.statusPanel === 'agTotalAndFilteredRowCountComponent');
    expect(TotalAndFiltersStatusPanelConfig).toBeTruthy();
    const TotalRowCountStatusPanelConfig = statusBar.find(x => x.statusPanel === 'agTotalRowCountComponent');
    expect(TotalRowCountStatusPanelConfig).toBeTruthy();
    const FilteredRowCountStatusPanelConfig = statusBar.find(x => x.statusPanel === 'agFilteredRowCountComponent');
    expect(FilteredRowCountStatusPanelConfig).toBeTruthy();
    const SelectedRowCountComponentStatusPanelConfig = statusBar.find(x => x.statusPanel === 'agSelectedRowCountComponent');
    expect(SelectedRowCountComponentStatusPanelConfig).toBeTruthy();
    const AggregationComponentStatusPanelConfig = statusBar.find(x => x.statusPanel === 'agAggregationComponent');
    expect(AggregationComponentStatusPanelConfig).toBeTruthy();
  });


});
