import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { amRoutes } from '@mpe/assortment-management';
import { sgmRoutes } from '@mpe/sgm';
import { MsalGuard } from '@azure/msal-angular';
import { LoginComponent } from '@mpe/auth';

export const routes: Routes = [
  { path: '', data: { name: 'Home' }, component: LoginComponent, canActivate: [MsalGuard] },
  { path: 'sgm', data: { name: 'Store Group Management' }, children: sgmRoutes, canActivate: [MsalGuard] },
  { path: 'am', data: { name: 'Assortment Management' }, children: amRoutes, canActivate: [MsalGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
