import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMultiselectDropdownComponent } from './input-multiselect-dropdown.component';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InputMultiselectDropdownComponent', () => {
  let component: InputMultiselectDropdownComponent;
  let fixture: ComponentFixture<InputMultiselectDropdownComponent>;
  let loader: HarnessLoader;
  let selectHarness: MatSelectHarness;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputMultiselectDropdownComponent],
      imports: [BrowserModule, BrowserAnimationsModule, MatSelectModule],
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(InputMultiselectDropdownComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    selectHarness = await loader.getHarness<MatSelectHarness>(MatSelectHarness);
  });

  it('should be able to check whether a select is in multi-selection mode', async () => {
    const multipleSelection = await loader.getHarness<MatSelectHarness>(MatSelectHarness);
    expect(await multipleSelection.isMultiple()).toBe(true);
  });

  it('should have the same number of options as arrayValues', async () => {
    // Set Variables
    component.arrayValues = ['002.001.001.001', '001.002.001.001', '001.001.002.001', '001.001.001.002'];
    const expectedCount = component.arrayValues.length;
    //Click the select element host
    (await selectHarness.host()).click();
    const actual = (await selectHarness.getOptions()).length;
    expect(actual).toBe(expectedCount);
  });

  it('should display displayWithValue from object', async () => {
    component.arrayValues = [
      {
        departmentId: '001',
        departmentLabel: 'Test Department',
      },
      {
        departmentId: '002',
        departmentLabel: 'Test Department 2',
      },
    ];
    component.displayWithValue = 'departmentLabel';
    await selectHarness.open();
    const selectOptions = await selectHarness.getOptions();
    await selectOptions[0].click();
    expect(await selectHarness.getValueText()).toBe('Test Department');
  });

  it('should make the dropdown required based on Input value', async () => {
    component.required = true;
    expect(await selectHarness.isRequired()).toBe(true);
  });

  it('should make the dropdown disabled based on Input value', async () => {
    component.disable = true;
    expect(await selectHarness.isDisabled()).toBe(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
