import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BroadcastService, MsalService, MSAL_CONFIG, MSAL_CONFIG_ANGULAR } from '@azure/msal-angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoginComponent } from './login.component';
import { MSALConfigFactory, MSALAngularConfigFactory } from '@mpe/auth';
import { RouterTestingModule } from '@angular/router/testing';

import * as AuthSections from '../../store/auth.state';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            auth: {
              UserProfile: {
                name: 'Testing',
                roles: ['Test'],
                username: 'Testing@dcsg.com',
              },
            },
          },
        }),
        {
          provide: MSAL_CONFIG,
          useFactory: MSALConfigFactory,
        },
        {
          provide: MSAL_CONFIG_ANGULAR,
          useFactory: MSALAngularConfigFactory,
        },
        MsalService,
        BroadcastService,
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain user information in html', () => {
    const startingElement = fixture.nativeElement;
    const startingElements = startingElement.querySelectorAll('[data-test="userInfo"]');
    expect(startingElements.length).toEqual(1);
    expect(startingElements[0].textContent).toEqual('Testing - Testing@dcsg.com');
  });
});