import { createAction, props } from '@ngrx/store';
import { IUserProfile } from '@mpe/auth';

export const setUserProfile = createAction('[App] Set User Data', props<{ UserProfile: IUserProfile }>());
