import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { EffectsModule } from '@ngrx/effects';

import 'ag-grid-enterprise';
import 'hammerjs';

import { MaterialModule } from '@mpe/material';
import { HeaderComponent } from './components/header/header.component';
import SharedEffects from './store/effects';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';

export const sharedRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule, MaterialModule, AgGridModule.withComponents([]), EffectsModule.forFeature([SharedEffects])],
  declarations: [HeaderComponent, ToastMessageComponent, MessageDialogComponent],
  exports: [HeaderComponent, AgGridModule, ToastMessageComponent, MessageDialogComponent],
})
export class SharedModule {}
