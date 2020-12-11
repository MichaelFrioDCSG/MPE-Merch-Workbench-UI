import { createReducer } from '@ngrx/store';
import { IAppState } from './state';

const initialState: IAppState = {
  Loading: false,
  ApplicationLoadErrors: [],
};

const reducer$ = createReducer(initialState);

export default function reducer(state: IAppState, action) {
  return reducer$(state, action);
}
export const appReducerKey = 'app';
