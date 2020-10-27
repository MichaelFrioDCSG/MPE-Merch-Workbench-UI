import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AgGridModule } from 'ag-grid-angular';

import { environment } from '../environments/environment';
import { AssortmentManagementModule } from '@mpe/assortment-management';
import appReducer, { appReducerKey } from '../store/reducer';
import appEffects from '../store/effects';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@mpe/shared';
import { AppRoutingModule } from './app-routing.module';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HeaderComponent } from './components/header/header.component';
import { SgmModule } from '@mpe/sgm';
import { AuthModule } from '@mpe/auth';
import { MaterialModule } from '@mpe/material';

import { AuthInterceptor, authProviders } from '@mpe/auth';

import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey(environment.agGridLicense);

@NgModule({
  declarations: [AppComponent, LandingPageComponent, HeaderComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    MaterialModule,
    AssortmentManagementModule,
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
    SgmModule,
    AuthModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ...authProviders,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
