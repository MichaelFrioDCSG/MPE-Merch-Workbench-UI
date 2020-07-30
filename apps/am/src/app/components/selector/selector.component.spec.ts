import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorComponent } from './selector.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectorComponent', () => {
  let component: SelectorComponent;
  let fixture: ComponentFixture<SelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectorComponent],
      imports: [BrowserAnimationsModule, MatTabsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
