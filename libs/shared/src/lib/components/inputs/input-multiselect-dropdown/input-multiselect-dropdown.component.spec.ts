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
import { InputSpinnerComponent } from '../input-spinner/input-spinner.component';

xdescribe('InputMultiselectDropdownComponent', () => {
  let component: InputMultiselectDropdownComponent;
  let fixture: ComponentFixture<InputMultiselectDropdownComponent>;
  let loader: HarnessLoader;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputMultiselectDropdownComponent],
      imports: [BrowserModule, BrowserAnimationsModule, MatSelectModule, InputSpinnerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputMultiselectDropdownComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should have the placeholder as the label', async () => {
    const expectedCount = 3;
    const selectHarness = await loader.getHarness<MatSelectHarness>(MatSelectHarness);

    //Click the select element host
    (await selectHarness.host()).click();
    const actual = (await selectHarness.getOptions()).length;
    expect(actual).toBe(expectedCount);
    /*
    const dropdownHarness = await loader.getHarness<MatSelectHarness>(MatSelectHarness);
    (await dropdownHarness.host()).click();
    const actual = (await dropdownHarness.getOptions()).length;
    expect(actual).toBe(expectedCount);
    */
  });
});
