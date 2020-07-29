import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-import-override-dialog',
  templateUrl: './import-override-dialog.component.html',
  styleUrls: ['./import-override-dialog.component.scss'],
})
export class ImportOverrideDialogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    //Pass in assortment period, sub-class and display dialog
    //Click over-ride
    //call the service to import new assortment buy plan
    //Click cancel
  }
}
