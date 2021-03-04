import { Component } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  template: `<a [routerLink]="[params.inRouterLink]">{{ params.value }}</a>`,
})
export class LinkRendererComponent implements AgRendererComponent {
  public params: any;

  public agInit(params: any): void {
    this.params = params;
  }

  public refresh(params: any): boolean {
    return false;
  }
}
