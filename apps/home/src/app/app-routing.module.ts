import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { amRoutes } from '@mpe/assortment-management';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

const routes: Routes = [
  { path: 'am', children: amRoutes },
  { path: '', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
