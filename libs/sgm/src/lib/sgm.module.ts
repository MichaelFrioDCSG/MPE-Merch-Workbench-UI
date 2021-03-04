import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MaterialModule } from '@mpe/material';
import { RumRunnerServiceModule } from '@mpe/rum-runner-service';

import { ClusterGroupService } from '@mpe/AsmtMgmtService';
import { InputSpinnerComponent, InputDropdownFilterComponent, InputMultiselectDropdownComponent, SharedModule } from '@mpe/shared';
import { FEATURE_KEY } from './store/state';
import { FEATURE_REDUCER_TOKEN, getReducers } from './store/reducer';
import StoreGroupMgmtEffects from './store/effects';

import { ImportClusterGroupDialogComponent } from './dialogs/import-cluster-group-dialog/import-cluster-group-dialog.component';
import { DetailComponent } from './components/detail/detail.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ManageClusterGroupDialogComponent } from './dialogs/manage-cluster-group-dialog/manage-cluster-group-dialog.component';

export const sgmRoutes: Route[] = [
  { path: ':id', component: DetailComponent },
  { path: '', component: SummaryComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RumRunnerServiceModule,
    AgGridModule.withComponents([]),
    StoreModule.forFeature(FEATURE_KEY, FEATURE_REDUCER_TOKEN),
    EffectsModule.forFeature(StoreGroupMgmtEffects),
  ],
  declarations: [
    SummaryComponent,
    ImportClusterGroupDialogComponent,
    ManageClusterGroupDialogComponent,
    InputSpinnerComponent,
    InputMultiselectDropdownComponent,
    InputDropdownFilterComponent,
    DetailComponent,
  ],
  exports: [SummaryComponent, DetailComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: FEATURE_REDUCER_TOKEN,
      useFactory: getReducers,
    },
    { provide: ClusterGroupService, useClass: ClusterGroupService },
  ],
})
export class SgmModule {}
