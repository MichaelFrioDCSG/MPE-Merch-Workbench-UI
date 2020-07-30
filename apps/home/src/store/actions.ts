import { createAction, props } from '@ngrx/store';

export const applicationLoading = createAction('[App] Application Loading Start');
export const applicationLoadingCompleted = createAction('[App] Application Loading Completed');
export const applicationLoadingFailure = createAction('[App] Application Loading Failure', props<{ errors: string[] }>());
