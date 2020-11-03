import { createAction, props } from '@ngrx/store';
import { IMessageDialogData } from '../components/message-dialog/IMessageDialogData';
import { INotificationData } from '../components/toast-message/INotificationData';
import { IWarningDialogData } from '../components/warning-dialog/IWarningDialogData';

export const showNotificaion = createAction('[Shrared] Show Notification', props<INotificationData>());
export const showMessageDialog = createAction('[Shrared] Show Message Dialog', props<IMessageDialogData>());
export const showWarningDialog = createAction('[Shrared] Show Warning Dialog', props<IWarningDialogData>());
