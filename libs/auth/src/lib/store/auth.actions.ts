import { createAction, props } from '@ngrx/store';
import { IUserProfile } from './models/IUserProfile';
import { ITokenResponse } from './models/ITokenResponse';

export const setUserProfile = createAction('[App] Set User Data', props<{ UserProfile: IUserProfile }>());
export const setUserToken = createAction('[App] Set User Token', props<{ TokenResponse: ITokenResponse }>());