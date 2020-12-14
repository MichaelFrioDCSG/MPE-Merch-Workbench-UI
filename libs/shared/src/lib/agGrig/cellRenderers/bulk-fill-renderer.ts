import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'bulk-fill-renderer',
  template: `
    <div>
      <span class="ag-cell-wrapper ag-row-group ag-row-group-indent-0 bulk-fill {{ groupCSSClass }}">
        <span class="ag-group-value">
          {{ value }}
        </span>
        <i
          class="mat-icon material-icons mat-icon-no-color"
          style="{{ !isAutoColumn && isGroup ? '' : 'display: none;' }}"
          role="img"
          aria-hidden="true"
          >arrow_drop_down</i
        >
      </span>
    </div>
  `,
})
export class BulkFillRenderer implements ICellRendererAngularComp {
  private params: ICellRendererParams;
  private get colId(): string {
    return this.params?.column.getColId();
  }
  public get isGroup(): boolean {
    return this.params?.node.group;
  }
  public get isAutoColumn(): boolean {
    return this.colId === 'ag-Grid-AutoColumn';
  }
  public get value(): string {
    if (!this.isAutoColumn && this.isGroup) {
      return 'Bulk Fill';
    }

    return this.params.valueFormatted ? this.params.valueFormatted : this.params.value;
  }
  public get groupCSSClass(): string {
    return !this.isAutoColumn && this.isGroup ? 'bulk-fill-group' : '';
  }

  public agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  public afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

  public refresh(params: ICellRendererParams): boolean {
    this.params = params;

    // return true to tell the grid we refreshed successfully
    return true;
  }
}
