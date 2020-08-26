import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-input-dropdown-filter',
  templateUrl: './input-dropdown-filter.component.html',
  styleUrls: ['./input-dropdown-filter.component.scss'],
})
export class InputDropdownFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public placeholder: string;
  @Input() public title: string;
  @Input() public loading: boolean;
  @Input() public arrayValues: any[] = [];
  @Input() public displayWithValue: string;
  @Input() public filterValue: string;
  @Input() public required: boolean;
  @Input() public disable: boolean;
  @Input() public inputFormControl: FormControl;
  @Output() public onValueChanged = new EventEmitter<any>();
  public formControl: FormControl = new FormControl('');
  public filteredArray: Observable<any[]>;
  public autoCompleteEnabled: string;

  public get isRequired(): boolean {
    return this.formControl && this.formControl.errors && this.formControl.errors.required;
  }
  constructor() {}

  public ngOnInit() {
    if (this.inputFormControl) {
      this.formControl = this.inputFormControl;
    }
    this.filterArray();
  }

  public ngOnChanges(changes) {
    if (changes.hasOwnProperty('arrayValues')) {
      this.filterArray();
    }
  }

  public ngOnDestroy() {}

  public onOptionSelected(evt: MatAutocompleteSelectedEvent): void {
    this.onValueChanged.emit(evt.option.value);
  }

  public getDisplayWith(value: any): string {
    if (this.displayWithValue && value) {
      return value[this.displayWithValue];
    } else {
      return value;
    }
  }

  public filterArray() {
    // valueChanges event fires both on typing into the autocomplete and making an autocomplete selection
    // We only want to apply filtering changes when the autocomplete typed value is changing
    this.filteredArray = this.formControl.valueChanges.pipe(
      startWith(''),
      map(inputValue => {
        // Handling the difference between typing to filter and selecting something in the dropdown
        if (typeof inputValue === 'string') {
          return inputValue ? this._filterArray(inputValue) : this.arrayValues.slice();
        }
      })
    );
  }

  private _filterArray(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (this.filterValue) {
      return this.arrayValues.filter(option => option[this.filterValue].toLowerCase().includes(filterValue));
    } else {
      return this.arrayValues.filter(option => option.toLowerCase().includes(filterValue));
    }
  }
}
