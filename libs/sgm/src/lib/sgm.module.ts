import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { MaterialModule } from '@mpe/material';

import { BrowserModule } from '@angular/platform-browser';

import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

export const sgmRoutes: Route[] = [{ path: '', component: LandingComponent }];

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
  ],
  declarations: [LandingComponent],
  exports: [LandingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SgmModule {}
