import { createAction, props } from '@ngrx/store';
import { IUserProfile } from './models/IUserProfile';

export const setUserProfile = createAction('[App] Set User Data', props<{ UserProfile: IUserProfile }>());
