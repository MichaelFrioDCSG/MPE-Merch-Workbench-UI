import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';

import { BrowserModule } from '@angular/platform-browser';

import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ImportStoreGroupDialogComponent } from './dialogs/import-store-group-dialog/import-store-group-dialog.component';
import { InputSpinnerComponent } from 'libs/shared/src/lib/components/inputs/input-spinner/input-spinner.component';
import { InputDropdownFilterComponent } from 'libs/shared/src/lib/components/inputs/input-dropdown-filter/input-dropdown-filter.component';
import { InputMultiselectDropdownComponent } from 'libs/shared/src/lib/components/inputs/input-multiselect-dropdown/input-multiselect-dropdown.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreModule } from '@ngrx/store';
import * as fromStoreGroupMgmt from './store/store-group-mgmt.reducer';
import { EffectsModule } from '@ngrx/effects';
import StoreGroupMgmtEffects from './store/store-group-mgmt.effects';
import { DetailComponent } from './components/detail/detail.component';
import { ToastMessageComponent } from 'libs/shared/src/lib/components/toast-message/toast-message.component';
import { from } from 'rxjs';

export const sgmRoutes: Route[] = [
  { path: ':id', component: DetailComponent },
  { path: '', component: LandingComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    AgGridModule.withComponents([]),
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
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
    ToastMessageComponent,
  ],
  exports: [LandingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SgmModule {}
