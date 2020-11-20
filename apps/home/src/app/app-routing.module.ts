import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { amRoutes } from '@mpe/assortment-management';
import { sgmRoutes } from '@mpe/sgm';
import { LoginComponent, AuthGuardService } from '@mpe/auth';

export const routes: Routes = [
  { path: 'login', pathMatch: 'prefix', data: { name: 'Login', display: false }, component: LoginComponent },
  { path: 'sgm', data: { name: 'Store Group Management' }, children: sgmRoutes, canActivate: [AuthGuardService] },
  { path: 'am', data: { name: 'Assortment Management' }, children: amRoutes, canActivate: [AuthGuardService] },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
