import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppModule as AmModule } from 'apps/am/src/app/app.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],

  imports: [BrowserModule, AppRoutingModule, AmModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
