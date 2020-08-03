import { BrowserModule, HammerModule } from '@angular/platform-browser';
import 'ag-grid-enterprise';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SummaryGridComponent } from './components/summary-grid/summary-grid.component';
import { DetailGridComponent } from './components/detail-grid/detail-grid.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SelectorComponent } from './components/selector/selector.component';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewEditDialogComponent } from './components/view-edit-dialog/view-edit-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { CreateManageViewDialogComponent } from './components/create-manage-view-dialog/create-manage-view-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import 'hammerjs';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { AmDetailModuleComponent } from './components/am-detail-module/am-detail-module.component';
import { ClusterAssignmentViewComponent } from './components/cluster-assignment-view/cluster-assignment-view.component';
import { ImportOverrideDialogComponent } from './components/import-override-dialog/import-override-dialog.component';
import { InputDropdownFilterComponent } from './components/inputs/input-dropdown-filter/input-dropdown-filter.component';
import { InputMultiselectDropdownComponent } from './components/inputs/input-multiselect-dropdown/input-multiselect-dropdown.component';
import { InputSpinnerComponent } from './components/inputs/input-spinner/input-spinner.component';

import { MaterialModule } from '@mpe/material';

@NgModule({
  declarations: [
    AppComponent,
    SummaryGridComponent,
    DetailGridComponent,
    ToolbarComponent,
    SelectorComponent,
    ImportDialogComponent,
    ViewEditDialogComponent,
    DeleteDialogComponent,
    CreateManageViewDialogComponent,
    AlertDialogComponent,
    ConfirmationDialogComponent,
    AmDetailModuleComponent,
    ClusterAssignmentViewComponent,
    ImportOverrideDialogComponent,
    InputDropdownFilterComponent,
    InputMultiselectDropdownComponent,
    InputSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HammerModule,
    MaterialModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
