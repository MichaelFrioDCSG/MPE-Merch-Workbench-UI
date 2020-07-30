import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssortmentManagementUIComponent } from './assortment-management-ui.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AssortmentManagementUIComponent', () => {
  let component: AssortmentManagementUIComponent;
  let fixture: ComponentFixture<AssortmentManagementUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssortmentManagementUIComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssortmentManagementUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
