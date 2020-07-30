import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmDetailModuleComponent } from './am-detail-module.component';

describe('AmDetailModuleComponent', () => {
  let component: AmDetailModuleComponent;
  let fixture: ComponentFixture<AmDetailModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AmDetailModuleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmDetailModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
