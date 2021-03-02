import { Component } from '@angular/core';
import { SummaryComponent } from './summary.component';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  template: `<a [routerLink]="[params.inRouterLink, params.data.id]">{{ params.value }}</a>`,
})
export class RenderPage implements AgRendererComponent {
  params: any;

  constructor(public summary: SummaryComponent) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }
}
