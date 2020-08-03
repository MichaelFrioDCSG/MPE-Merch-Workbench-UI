import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import 'ag-grid-enterprise';
import 'hammerjs';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '@mpe/material';
import { HeaderComponent } from './components/header/header.component';

export const sharedRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, AgGridModule.withComponents([])],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class SharedModule {}
