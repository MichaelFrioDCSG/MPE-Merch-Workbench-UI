import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { AllCommunityModules, Module } from '@ag-grid-community/all-modules';

import { IClusterGroup } from '../../../../../shared/models/IClusterGroup';
import { Store, select } from '@ngrx/store';
import { selectClusterGroups, IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';
import { Observable } from 'rxjs';
import * as actions from '../../store/store-group-mgmt.actions';
import { ImportStoreGroupDialogComponent } from '../../dialogs/import-store-group-dialog/import-store-group-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'mpe-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public clusterGroupsObs: Observable<IClusterGroup[]> = null;

  public modules: Module[] = AllCommunityModules;
  public selectedData: any;
  public title = 'MPE-SGM';
  public clusterGroups: IClusterGroup[] = [];
  public defaultColDef: any = {
    resizable: true,
  };
  public columnDefs = [
    {
      headerName: '',
      width: 40,
      editable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: false,
      checkboxSelection: true,
    },
    { headerName: 'Cluster Group Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Cluster Group Desc', field: 'description', sortable: true, filter: true, width: 200 },
    { headerName: 'Assortment Period', field: 'asmtPeriod.asmtPeriodLabel', sortable: true, filter: true },
    // TODO, once available on back end:
    // { headerName: 'Last Modified Date', field: 'lastModifiedDate', sortable: true, filter: true },
    // { headerName: 'Last Modified By', field: 'lastModifiedBy', sortable: true, filter: true },
  ];

  constructor(private dialog: MatDialog, private store: Store<IStoreGroupMgmtState>, public titleService: Title) {}

  public ngOnDestroy() {}

  public ngOnInit() {
    this.titleService.setTitle('Store Group Management');
  }

  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
  }

  public getClusterGroupHeaders() {
    this.store.pipe(select(selectClusterGroups)).subscribe((clusterGroups: IClusterGroup[]) => {
      this.clusterGroups = clusterGroups;
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(ImportStoreGroupDialogComponent, {
      width: '100rem',
      data: {},
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getClusterGroupHeaders();
    });
  }

  public onGridReady(params) {
    this.store.dispatch(actions.sgmGetSummaries());

    this.getClusterGroupHeaders();
  }
}
