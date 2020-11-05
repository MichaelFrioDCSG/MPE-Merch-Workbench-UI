import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { StoreModule } from '@ngrx/store';
import * as AuthReducer from './store/auth.reducers';
import { BrowserModule } from '@angular/platform-browser';
import { MsalModule } from '@azure/msal-angular';
import { EffectsModule } from '@ngrx/effects';
import AuthEffects from './store/auth.effects';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    StoreModule.forFeature(AuthReducer.authReducerKey, AuthReducer.reducer),
    EffectsModule.forFeature([AuthEffects]),
    MsalModule,
  ],
  declarations: [LoginComponent],
  exports: [MsalModule],
})
export class AuthModule {}
