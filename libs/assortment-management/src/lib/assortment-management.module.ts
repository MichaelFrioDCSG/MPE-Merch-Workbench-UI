import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AssortmentManagementUIComponent } from './containers/assortment-management-ui/assortment-management-ui.component';
import { SummaryComponent } from './components/summary/summary.component';
import { SharedModule } from '@mpe/shared';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ImportDialogComponent } from './components/dialogs/import-dialog/import-dialog.component';
import { AlertDialogComponent } from './components/dialogs/alert-dialog/alert-dialog.component';
import { MaterialModule } from '@mpe/material';
import { ImportOverrideDialogComponent } from './components/dialogs/import-override-dialog/import-override-dialog.component';
import { InputDropdownFilterComponent } from './components/inputs/input-dropdown-filter/input-dropdown-filter.component';
import { InputMultiselectDropdownComponent } from './components/inputs/input-multiselect-dropdown/input-multiselect-dropdown.component';
import { InputSpinnerComponent } from './components/inputs/input-spinner/input-spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const amRoutes: Route[] = [{ path: '', component: SummaryComponent }];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterModule, BrowserAnimationsModule, SharedModule, MaterialModule],
  declarations: [
    AssortmentManagementUIComponent,
    SummaryComponent,
    ConfirmationDialogComponent,
    ImportDialogComponent,
    AlertDialogComponent,
    ImportOverrideDialogComponent,
    InputDropdownFilterComponent,
    InputMultiselectDropdownComponent,
    InputSpinnerComponent,
  ],
  exports: [
    SummaryComponent,
    ConfirmationDialogComponent,
    ImportDialogComponent,
    AlertDialogComponent,
    ImportOverrideDialogComponent,
    InputDropdownFilterComponent,
    InputMultiselectDropdownComponent,
    InputSpinnerComponent,
  ],
  entryComponents: [AlertDialogComponent, ConfirmationDialogComponent, ImportDialogComponent, ImportOverrideDialogComponent],
})
export class AssortmentManagementModule {}
