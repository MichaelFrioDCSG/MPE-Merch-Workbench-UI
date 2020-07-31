import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssortmentManagementModule, assortmentManagementRoutes } from '@mpe/assortment-management';
import { routes as amRoutes } from '@mpe/am/src/app/app-routing.module';

const routes: Routes = [
  { path: 'amui', children: assortmentManagementRoutes },
  { path: 'am', children: amRoutes },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
