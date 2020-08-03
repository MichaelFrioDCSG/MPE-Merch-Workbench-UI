import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { amRoutes } from '@mpe/assortment-management';

const routes: Routes = [{ path: 'am', children: amRoutes }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
