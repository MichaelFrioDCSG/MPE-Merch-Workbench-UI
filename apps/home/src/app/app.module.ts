import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';

import { environment } from '../environments/environment';
import { AppModule as AmModule } from '@mpe/am/src/app/app.module';

import appReducer, { appReducerKey } from '../store/reducer';
import appEffects from '../store/effects';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmModule,
    AgGridModule.withComponents([]),
    StoreModule.forRoot(
      { [appReducerKey]: appReducer },
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([appEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
