import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { amRoutes } from '@mpe/assortment-management';
import { sgmRoutes } from '@mpe/sgm';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: 'sgm', data: { name: 'Store Group Management' }, children: sgmRoutes, canActivate: [MsalGuard] },
  { path: 'am', data: { name: 'Assortment Management' }, children: amRoutes },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
