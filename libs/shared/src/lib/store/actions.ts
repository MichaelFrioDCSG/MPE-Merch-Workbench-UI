import { createAction, props } from '@ngrx/store';

export const showNotificaion = createAction('[Shrared] Show Notification', props<{ title: string; isError?: boolean; messages: string[] }>());
