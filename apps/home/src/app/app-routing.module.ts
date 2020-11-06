import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { amRoutes } from '@mpe/assortment-management';
import { sgmRoutes } from '@mpe/sgm';
import { CodeComponent, LoginComponent } from '@mpe/auth';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: 'login', data: { name: 'Login' }, component: LoginComponent },
  { path: 'code', data: { name: 'Code' }, component: CodeComponent },
  { path: '', data: { name: 'Home' }, component: LandingPageComponent },
  { path: 'sgm', data: { name: 'Store Group Management' }, children: sgmRoutes },
  { path: 'am', data: { name: 'Assortment Management' }, children: amRoutes },
  // { path: '', data: { name: 'Home' }, component: LoginComponent, canActivate: [MsalGuard] },
  // { path: 'sgm', data: { name: 'Store Group Management' }, children: sgmRoutes, canActivate: [MsalGuard] },
  // { path: 'am', data: { name: 'Assortment Management' }, children: amRoutes, canActivate: [MsalGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
