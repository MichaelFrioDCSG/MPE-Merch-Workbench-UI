import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MaterialModule } from '@mpe/material';

import { ClusterGroupsService } from '@mpe/AsmtMgmtService';

import StoreGroupMgmtEffects from './store/store-group-mgmt.effects';
import * as fromStoreGroupMgmt from './store/store-group-mgmt.reducer';

import { ImportStoreGroupDialogComponent } from './dialogs/import-store-group-dialog/import-store-group-dialog.component';
import { InputSpinnerComponent } from 'libs/shared/src/lib/components/inputs/input-spinner/input-spinner.component';
import { InputDropdownFilterComponent } from 'libs/shared/src/lib/components/inputs/input-dropdown-filter/input-dropdown-filter.component';
import { InputMultiselectDropdownComponent } from 'libs/shared/src/lib/components/inputs/input-multiselect-dropdown/input-multiselect-dropdown.component';
import { DetailComponent } from './components/detail/detail.component';
import { LandingComponent } from './components/landing/landing.component';

export const sgmRoutes: Route[] = [
  { path: ':id', component: DetailComponent },
  { path: '', component: LandingComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgGridModule.withComponents([]),
    StoreModule.forFeature(fromStoreGroupMgmt.storeGroupMgmtFeatureKey, fromStoreGroupMgmt.reducer),
    EffectsModule.forFeature([StoreGroupMgmtEffects]),
  ],
  declarations: [
    LandingComponent,
    ImportStoreGroupDialogComponent,
    InputSpinnerComponent,
    InputMultiselectDropdownComponent,
    InputDropdownFilterComponent,
    DetailComponent,
  ],
  exports: [LandingComponent, DetailComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: ClusterGroupsService, useClass: ClusterGroupsService }],
})
export class SgmModule {}
