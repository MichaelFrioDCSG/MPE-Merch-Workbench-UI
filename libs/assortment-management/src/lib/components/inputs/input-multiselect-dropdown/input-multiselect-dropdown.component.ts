import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'mpe-input-multiselect-dropdown',
  templateUrl: './input-multiselect-dropdown.component.html',
  styleUrls: ['./input-multiselect-dropdown.component.scss'],
})
export class InputMultiselectDropdownComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public placeholder: string;
  @Input() public title: string;
  @Input() public loading: boolean;
  @Input() public disable: boolean;
  @Input() public arrayValues: any[] = [];
  @Input() public displayWithValue: string;
  @Input() public inputFormControl: FormControl;

  @Output() public onValueChanged = new EventEmitter<any>();

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
