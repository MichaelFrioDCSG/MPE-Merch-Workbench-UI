import { createAction, props } from '@ngrx/store';
import { IMessageDialogData } from '../components/message-dialog/message-dialog.component';
import { INotificationData } from '../components/toast-message/INotificationData';

export const showNotificaion = createAction('[Shrared] Show Notification', props<INotificationData>());
export const showMessageDialog = createAction('[Shrared] Show Message Dialog', props<IMessageDialogData>());
