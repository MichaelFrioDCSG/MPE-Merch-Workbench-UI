import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { SgmModule } from '@mpe/sgm';
import { AuthModule } from '@mpe/auth';
import { MaterialModule } from '@mpe/material';

import { MSAL_CONFIG, MSAL_CONFIG_ANGULAR, MsalService, MsalModule } from '@azure/msal-angular';
import { AuthInterceptor, MSALConfigFactory, MSALAngularConfigFactory } from '@mpe/auth';
import { CommonModule } from '@angular/common';

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
    MsalModule,
    AuthModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory,
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory,
    },
    MsalService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [LandingPageComponent, HeaderComponent],
})
export class AppModule {}
