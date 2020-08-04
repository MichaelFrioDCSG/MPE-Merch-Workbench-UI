import { TestBed, async } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './components/header/header.component';

describe('AppComponent', () => {
  let store: MockStore;
  const initialState = { Loading: false, ApplicationLoadErrors: [] };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, HeaderComponent],
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'home'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('home');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Portal APP');
  });
});
