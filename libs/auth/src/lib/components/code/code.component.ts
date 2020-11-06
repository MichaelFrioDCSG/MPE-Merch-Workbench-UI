import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as msal from '@azure/msal-browser';

@Component({
  selector: 'mpe-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
})
export class CodeComponent implements OnInit {
  private msalInstance: msal.PublicClientApplication;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  public ngOnInit(): void {
    const routeFragment: Observable<string> = this.activatedRoute.fragment;
    routeFragment.subscribe(fragment => {
      let token: string = fragment.match(/^(.*?)&/)[1].replace('code=', '');
      sessionStorage.setItem('code', token);
    });

    // try {
    //   const loginResponse = await this.msalInstance.loginPopup(loginRequest);
    // } catch (err) {
    //   // handle error
    // }

    // const myAccounts: msal.AccountInfo[] = this.msalInstance.getAllAccounts();
    // const username = "test@contoso.com";
    // const myAccount: AccountInfo = msalInstance.getAccountByUsername(username);

    // const homeAccountId = "userid.hometenantid"; // Best to retrieve the homeAccountId from an account object previously obtained through msal
    // const myAccount: AccountInfo = maslInstance.getAccountByHomeId(homeAccountId);
  }
}
