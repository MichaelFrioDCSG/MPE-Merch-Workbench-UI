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

import { ClusterGroupService } from '@mpe/AsmtMgmtService';
import { InputSpinnerComponent, InputDropdownFilterComponent, InputMultiselectDropdownComponent } from '@mpe/shared';

import StoreGroupMgmtEffects from './store/store-group-mgmt.effects';
import * as fromStoreGroupMgmt from './store/store-group-mgmt.reducer';

import { ImportClusterGroupDialogComponent } from './dialogs/import-cluster-group-dialog/import-cluster-group-dialog.component';
import { DetailComponent } from './components/detail/detail.component';
import { SummaryComponent } from './components/summary/summary.component';

export const sgmRoutes: Route[] = [
  { path: ':id', component: DetailComponent },
  { path: '', component: SummaryComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgGridModule.withComponents([]),
    StoreModule.forFeature(fromStoreGroupMgmt.storeGroupMgmtFeatureKey, fromStoreGroupMgmt.reducer),
    EffectsModule.forFeature([StoreGroupMgmtEffects]),
  ],
  declarations: [
    SummaryComponent,
    ImportClusterGroupDialogComponent,
    InputSpinnerComponent,
    InputMultiselectDropdownComponent,
    InputDropdownFilterComponent,
    DetailComponent,
  ],
  exports: [SummaryComponent, DetailComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: ClusterGroupService, useClass: ClusterGroupService }],
})
export class SgmModule {}
