import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-input-multiselect-dropdown',
  templateUrl: './input-multiselect-dropdown.component.html',
  styleUrls: ['./input-multiselect-dropdown.component.scss'],
})
export class InputMultiselectDropdownComponent implements OnInit {
  @Input() public placeholder: string;
  @Input() public title: string;
  @Input() public loading: boolean;
  @Input() public disable: boolean;
  @Input() public arrayValues: any[] = [];
  @Input() public displayWithValue: string;
  @Input() public inputFormControl: FormControl;

  @Output() onValueChanged = new EventEmitter<any>();

  public formControl: FormControl = new FormControl('');

  constructor() {}

  public ngOnInit() {
    if (this.inputFormControl) {
      this.formControl = this.inputFormControl;
    }
  }

  public ngOnChanges(changes) {}

  public ngOnDestroy() {}

  public selectionChanged(evt: MatSelectChange) {
    this.onValueChanged.emit(evt.value);
  }

  public getDisplayWith(value: any): string {
    if (this.displayWithValue) {
      return value[this.displayWithValue];
    } else {
      return value;
    }
  }
}
