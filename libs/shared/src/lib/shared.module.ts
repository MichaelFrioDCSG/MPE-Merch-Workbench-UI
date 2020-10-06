import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { EffectsModule } from '@ngrx/effects';

import 'ag-grid-enterprise';
import 'hammerjs';

import { MaterialModule } from '@mpe/material';
import { HeaderComponent } from './components/header/header.component';
import SharedEffects from './store/effects';

export const sharedRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, AgGridModule.withComponents([]), EffectsModule.forFeature([SharedEffects])],
  declarations: [HeaderComponent],
  exports: [HeaderComponent, AgGridModule],
})
export class SharedModule {}
