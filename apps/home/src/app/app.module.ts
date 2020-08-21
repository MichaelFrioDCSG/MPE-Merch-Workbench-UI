import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';

import { environment } from '../environments/environment';
import { AssortmentManagementModule } from '@mpe/assortment-management';
import appReducer, { appReducerKey } from '../store/reducer';
import appEffects from '../store/effects';

import { AppComponent } from './app.component';
import { SharedModule } from '@mpe/shared';
import { AppRoutingModule } from './app-routing.module';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent, LandingPageComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AssortmentManagementModule,
    MatIconModule,
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
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [LandingPageComponent, HeaderComponent],
})
export class AppModule {}
