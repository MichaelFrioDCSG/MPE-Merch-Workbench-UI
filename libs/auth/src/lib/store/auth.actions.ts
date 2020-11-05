import { createAction, props } from '@ngrx/store';
import { IUserProfile } from '../models/IUserProfile';

export const login = createAction('[App] Login');
export const logout = createAction('[App] Logout');
export const setUserProfile = createAction('[App] Set User Data', props<{ UserProfile: IUserProfile }>());
