import { createReducer, on, Action } from '@ngrx/store';
import { IAssortment } from '@mpe/shared';
import * as actions from './assortment-mgmt.actions';

export interface IAssortmentMgmtState {
  assortments: IAssortment[];
  selectedAssortments: IAssortment[];
  loading: boolean;
  edited: boolean;
  getSummaryErrorMessages: string[];
  getDetailsErrorMessages: string[];
}

export const initialState: IAssortmentMgmtState = {
  assortments: [],
  selectedAssortments: [],
  loading: false,
  edited: false,
  getSummaryErrorMessages: [],
  getDetailsErrorMessages: [],
};

const reducer$ = createReducer(
  initialState,
  on(
    actions.amGetSummaries,
    (state: IAssortmentMgmtState): IAssortmentMgmtState => ({
      ...state,
      assortments: [],
      loading: true,
      getSummaryErrorMessages: [],
    })
  ),
  on(
    actions.amGetSummariesSuccess,
    (state: IAssortmentMgmtState, action): IAssortmentMgmtState => ({
      ...state,
      assortments: action.assortments,
      loading: false,
      getSummaryErrorMessages: [],
    })
  ),
  on(
    actions.amGetSummariesFailure,
    (state: IAssortmentMgmtState, action): IAssortmentMgmtState => ({
      ...state,
      assortments: [],
      loading: false,
      getSummaryErrorMessages: action.errors,
    })
  )
);

export const assortmentMgmtFeatureKey = 'assortmentMgmt';
export function reducer(state: IAssortmentMgmtState | undefined, action: Action) {
  return reducer$(state, action);
}
