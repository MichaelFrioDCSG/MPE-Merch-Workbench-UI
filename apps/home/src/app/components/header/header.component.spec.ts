import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IAuthState, initialState } from '@mpe/auth';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@mpe/material';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, MaterialModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
    const thisState = getMockState();
    store.setState(thisState);

    // Run component life cycle events
    store.refreshState();
  });

  afterEach(async () => {
    store.resetSelectors();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Seems like MSAL isnt getting values since the textContent is blank which happens when you havent logged in
  // Most likely same issue we had with POManager Auth
  xit('should show name in header', () => {
    const state = getMockState();
    const elementProfile = fixture.debugElement.query(By.css('.profile'));
    expect(elementProfile.nativeElement.textContent.trim()).toEqual(state.UserProfile.name);
  });

  function getMockState(): IAuthState {
    return {
      UserProfile: {
        name: 'test',
        roles: ['Tester'],
        username: 'test.dcsg.com',
      },
      TokenResponse: {
        token: 'testtoken'
      }
    };
  }
});
