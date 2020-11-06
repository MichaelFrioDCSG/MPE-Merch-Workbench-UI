import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { StoreModule } from '@ngrx/store';
import * as AuthReducer from './store/auth.reducers';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import AuthEffects from './store/auth.effects';
import { CodeComponent } from './components/code/code.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    StoreModule.forFeature(AuthReducer.authReducerKey, AuthReducer.reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [LoginComponent, CodeComponent],
})
export class AuthModule {}
