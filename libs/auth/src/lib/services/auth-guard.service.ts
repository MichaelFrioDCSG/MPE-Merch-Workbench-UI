import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { IUserProfile, IAuthState, selectUserProfile } from '@mpe/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  private userProfile: IUserProfile;
  private get isLoggedIn() {
    return this.userProfile && this.userProfile.username;
  }

  constructor(private router: Router, private store: Store<IAuthState>) {
    this.store.select(selectUserProfile).subscribe((profile: IUserProfile) => {
      this.userProfile = profile;
    });
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //check if user authenticated, cancel navigation and re-direct to login if not
    if (!this.isLoggedIn) {
      const retUrl = route.url.length === 0 ? 'sgm' : route.url;
      const queryParams = { queryParams: { retUrl } };
      this.router.navigate(['login'], queryParams);
      //return false to cancel the navigation
      return false;
    }
    //user is authenticated - continue to route
    return true;
  }
}
