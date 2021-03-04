import { initialState, authReducerKey } from './auth.reducers';
import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { IAuthState } from './models/IAuthState';
import { Observable } from 'rxjs';
import { selectAuthState } from '@mpe/auth';
import { IUserProfile } from './models/IUserProfile';

export const getSGMUserRolesFn = createSelector(selectAuthState, (state: IAuthState): string[] => state.UserProfile.roles);

export const userCanEditSGMFn = createSelector(selectAuthState, (state: IAuthState): boolean => state.UserProfile.roles.includes("SGMWrite") || state.UserProfile.roles.includes("Admin"));
export const userCanEditAMFn = createSelector(selectAuthState, (state: IAuthState): boolean => state.UserProfile.roles.includes("AMWrite") || state.UserProfile.roles.includes("Admin"));
export const userCanViewSGMFn = createSelector(selectAuthState, (state: IAuthState): boolean => state.UserProfile.roles.includes("SGMRead") || state.UserProfile.roles.includes("SGMWrite") || state.UserProfile.roles.includes("Admin"));
export const userCanViewAMFn = createSelector(selectAuthState, (state: IAuthState): boolean => state.UserProfile.roles.includes("AMRead") || state.UserProfile.roles.includes("AMWrite") || state.UserProfile.roles.includes("Admin"));

@Injectable({ providedIn: 'root' })
export class AuthSelectors {
    constructor(private store: Store<IAuthState>) { }

    public userCanEditSGM(): Observable<boolean> {
        return this.store.select(userCanEditSGMFn)
    }

    public userCanEditAM(): Observable<boolean> {
        return this.store.select(userCanEditAMFn).pipe();
    }

    public userCanViewSGM(): Observable<boolean> {
        return this.store.select(userCanViewSGMFn);
    }

    public userCanViewAM(): Observable<boolean> {
        return this.store.select(userCanViewAMFn);
    }
}
