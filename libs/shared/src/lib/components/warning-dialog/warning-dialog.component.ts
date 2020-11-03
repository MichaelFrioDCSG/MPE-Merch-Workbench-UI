import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IWarningDialogData } from './IWarningDialogData';
@Component({
  selector: 'mpe-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IWarningDialogData) {}

  public ngOnInit(): void {}
}
