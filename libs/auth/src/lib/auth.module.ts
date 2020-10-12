import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { StoreModule } from '@ngrx/store';
import * as AuthReducer from './store/auth.reducers';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [CommonModule, BrowserModule, StoreModule.forFeature(AuthReducer.authReducerKey, AuthReducer.reducer)],
  declarations: [LoginComponent],
})
export class AuthModule {}
