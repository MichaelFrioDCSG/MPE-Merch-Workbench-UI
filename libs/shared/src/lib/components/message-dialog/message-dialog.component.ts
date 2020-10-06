import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'mpe-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
})
export class MessageDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IMessageDialogData
  ) {}

  ngOnInit(): void {}

  public onClose(): void {
    this.dialogRef.close(null);
  }
}

export interface IMessageDialogData {
  messages: string[];
}
