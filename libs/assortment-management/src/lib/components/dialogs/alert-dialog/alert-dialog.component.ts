import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mpe-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent implements OnInit {
  public message = '';
  public cancelButtonText = 'Cancel';

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<AlertDialogComponent>) {}

  public ngOnInit(): void {
    if (this.data) {
      this.message = this.data.message || this.message;
      if (this.data.buttonText) {
        this.cancelButtonText = this.data.buttonText.cancel || this.cancelButtonText;
      }
    }
    this.dialogRef.updateSize('300vw', '300vw');
  }

  public onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
