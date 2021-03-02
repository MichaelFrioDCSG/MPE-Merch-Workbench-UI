import { Component } from '@angular/core';
import { SummaryComponent } from './summary.component';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  template: `<a [routerLink]="[params.inRouterLink, params.data.id]">{{ params.value }}</a>`,
})
export class RenderPage implements AgRendererComponent {
  public params: any;

  constructor(public summary: SummaryComponent) {}

  public agInit(params: any): void {
    this.params = params;
  }

  public refresh(params: any): boolean {
    return false;
  }
}
