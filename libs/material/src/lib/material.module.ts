import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';

const material_modules = [
  MatButtonModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatTabsModule,
  MatSelectModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
];

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, ...material_modules],
  exports: [...material_modules],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MAT_SNACK_BAR_DATA, useValue: {} },
  ],
})
export class MaterialModule {}

export { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
