import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RumRunnerService implements OnInit {
  private elkRUM: any;

  constructor() {}

  public ngOnInit() {
    if (!window['elkRUM'] || !window['elkRUM'].setCustom) {
      throw Error('You must add a script tag somewhere to include the rum runner library.');
    }
    this.elkRUM = window['elkRUM'];
  }

  public setCustom(eventName: string, value: any = {}) {
    if (!this.elkRUM) this.ngOnInit();
    this.elkRUM.setCustom(eventName, value);
  }
}
