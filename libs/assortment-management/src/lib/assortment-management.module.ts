import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AssortmentManagementUIComponent } from './containers/assortment-management-ui/assortment-management-ui.component';

export const assortmentManagementRoutes: Route[] = [{ path: '', component: AssortmentManagementUIComponent }];

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [AssortmentManagementUIComponent],
})
export class AssortmentManagementModule {}
