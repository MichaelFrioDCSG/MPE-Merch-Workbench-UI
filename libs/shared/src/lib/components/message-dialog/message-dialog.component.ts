import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'mpe-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
})
export class MessageDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: IMessageDialogData,
    public dialogRef: MatDialogRef<MessageDialogComponent>
  ) {}

  public onClose(): void {
    this.dialogRef.close(null);
  }
}

export interface IMessageDialogData {
  messages: string[];
}
