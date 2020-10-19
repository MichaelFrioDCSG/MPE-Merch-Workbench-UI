import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMessageDialogData } from './IMessageDialogData';

@Component({
  selector: 'mpe-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
})
export class MessageDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: IMessageDialogData
  ) {}
}
