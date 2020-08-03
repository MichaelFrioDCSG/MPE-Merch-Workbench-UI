import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AssortmentManagementUIComponent } from './containers/assortment-management-ui/assortment-management-ui.component';
import { SummaryComponent } from './components/summary/summary.component';

export const amRoutes: Route[] = [{ path: '', component: SummaryComponent }];

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [AssortmentManagementUIComponent, SummaryComponent],
  exports: [SummaryComponent],
})
export class AssortmentManagementModule {}
