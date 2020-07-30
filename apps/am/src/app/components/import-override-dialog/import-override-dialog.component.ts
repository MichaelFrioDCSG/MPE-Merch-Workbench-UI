import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import-override-dialog',
  templateUrl: './import-override-dialog.component.html',
  styleUrls: ['./import-override-dialog.component.scss'],
})
export class ImportOverrideDialogComponent implements OnInit {
  constructor() {}

  public ngOnInit(): void {
    //Pass in assortment period, sub-class and display dialog
    //Click over-ride
    //call the service to import new assortment buy plan
    //Click cancel
  }
}
