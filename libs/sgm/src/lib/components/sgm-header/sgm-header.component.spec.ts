import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SgmHeaderComponent } from './sgm-header.component';
import { MaterialModule } from '@mpe/material';

describe('SgmHeaderComponent', () => {
  let component: SgmHeaderComponent;
  let fixture: ComponentFixture<SgmHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SgmHeaderComponent],
      imports: [RouterTestingModule, MaterialModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgmHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
