import { Injectable } from '@angular/core';
import { createAction, props, Store } from '@ngrx/store';
import { IMessageDialogData } from '../components/message-dialog/IMessageDialogData';
import { INotificationData } from '../components/toast-message/INotificationData';
import { IWarningDialogData } from '../components/warning-dialog/IWarningDialogData';

export const showNotification = createAction('[Shared] Show Notification', props<INotificationData>());
export const showMessageDialog = createAction('[Shared] Show Message Dialog', props<IMessageDialogData>());
export const showWarningDialog = createAction('[Shared] Show Warning Dialog', props<IWarningDialogData>());

@Injectable({ providedIn: 'root' })
export class SharedActions {
  constructor(private store: Store) {}

  public showNotification(data: INotificationData): void {
    this.store.dispatch(showNotification(data));
  }

  public showMessageDialog(data: IMessageDialogData) {
    this.store.dispatch(showMessageDialog(data));
  }

  public showWarningDialog(data: IWarningDialogData) {
    this.store.dispatch(showWarningDialog(data));
  }
}
