import { ICellRendererComp, ICellRendererParams, Promise } from 'ag-grid-community';

export class BulkFillRenderer implements ICellRendererComp {
  private eGui: HTMLElement;
  private eCellWrapper: HTMLElement;
  private eIcon: HTMLElement;
  private eValue: HTMLElement;

  public refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    if (params.column.getColId() !== 'ag-Grid-AutoColumn' && params.node.group) {
      this.eValue.innerHTML = 'Bulk Fill';
    } else {
      this.eValue.innerHTML = params.valueFormatted ? params.valueFormatted : params.value;
    }

    // return true to tell the grid we refreshed successfully
    return true;
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public init?(params: ICellRendererParams): void | Promise<void> {
    this.eGui = document.createElement('div');

    // Create the same content struct that ag-grid uses to limit the ammount of styling this needs
    //  to display correctly
    this.eCellWrapper = document.createElement('span');
    this.eCellWrapper.className = 'ag-cell-wrapper ag-row-group ag-row-group-indent-0 bulk-fill';
    this.eGui.appendChild(this.eCellWrapper);

    // This will be either the value or 'Bulk Fill'
    this.eValue = document.createElement('span');
    this.eValue.className = 'ag-group-value';
    this.eCellWrapper.appendChild(this.eValue);

    // Only add the Bulk Fill elements if not an auto column and if it is a group row
    if (params.column.getColId() !== 'ag-Grid-AutoColumn' && params.node.group) {
      // Add Css Class for a group row cell
      this.eCellWrapper.className += ' bulk-fill-group';

      // Create the down arrow icon
      this.eIcon = document.createElement('mat-icon');
      this.eCellWrapper.appendChild(this.eIcon);
      this.eIcon.className = 'mat-icon material-icons mat-icon-no-color';
      this.eIcon.innerHTML = 'arrow_drop_down';

      // Add attributes that mat-icon needs to renderer correctly
      const eIconRoleAttr = document.createAttribute('role');
      eIconRoleAttr.value = 'img';
      const eIconAriaAttr = document.createAttribute('aria-hidden');
      eIconAriaAttr.value = 'true';
      this.eIcon.attributes.setNamedItem(eIconRoleAttr);
      this.eIcon.attributes.setNamedItem(eIconAriaAttr);
    }

    // set value into the cell
    this.refresh(params);
  }
}
