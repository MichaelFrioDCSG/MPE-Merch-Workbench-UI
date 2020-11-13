import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { amRoutes } from '@mpe/assortment-management';
import { sgmRoutes } from '@mpe/sgm';
import { LoginComponent } from '@mpe/auth';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGaurdService } from '@mpe/auth';

export const routes: Routes = [
  { path: 'login', pathMatch: 'prefix', data: { name: 'Login', render: false }, component: LoginComponent },
  //{ path: 'login', component: LoginComponent },
  { path: '', pathMatch: 'full', data: { name: 'Home' }, component: LandingPageComponent, canActivate: [AuthGaurdService] },
  { path: 'sgm', data: { name: 'Store Group Management' }, children: sgmRoutes, canActivate: [AuthGaurdService] },
  { path: 'am', data: { name: 'Assortment Management' }, children: amRoutes, canActivate: [AuthGaurdService] },
  // { path: '', data: { name: 'Home' }, component: LoginComponent, canActivate: [MsalGuard] },
  // { path: 'sgm', data: { name: 'Store Group Management' }, children: sgmRoutes, canActivate: [MsalGuard] },
  // { path: 'am', data: { name: 'Assortment Management' }, children: amRoutes, canActivate: [MsalGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
