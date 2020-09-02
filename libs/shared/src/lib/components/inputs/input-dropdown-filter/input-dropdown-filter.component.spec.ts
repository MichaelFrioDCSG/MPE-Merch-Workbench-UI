import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDropdownFilterComponent } from './input-dropdown-filter.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('InputDropdownComponent', () => {
  let component: InputDropdownFilterComponent;
  let fixture: ComponentFixture<InputDropdownFilterComponent>;
  let loader: HarnessLoader;
  let inputHarness: MatInputHarness;
  let autocompleteHarness: MatAutocompleteHarness;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputDropdownFilterComponent],
      imports: [BrowserModule, BrowserAnimationsModule, MatInputModule, MatAutocompleteModule],
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(InputDropdownFilterComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    inputHarness = await loader.getHarness<MatInputHarness>(MatInputHarness);
    autocompleteHarness = await loader.getHarness<MatAutocompleteHarness>(MatAutocompleteHarness);
  });

  it('should have the same number of options as arrayValues', async () => {
    // Set Variables
    component.arrayValues = ['002.001.001.001', '001.002.001.001', '001.001.002.001', '001.001.001.002'];
    component.filterArray();
    const expectedCount = component.arrayValues.length;
    await inputHarness.focus(); // Focus the input to make sure the autocomplete panel is shown.
    (await inputHarness.host()).click();
    const options = await autocompleteHarness.isOpen();
    console.log(options);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
