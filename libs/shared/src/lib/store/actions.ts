import { createAction, props } from '@ngrx/store';
import { IMessageDialogData } from '../components/message-dialog/IMessageDialogData';
import { INotificationData } from '../components/toast-message/INotificationData';
import { IWarningDialogData } from '../components/warning-dialog/IWarningDialogData';

export const showNotificaion = createAction('[Shared] Show Notification', props<INotificationData>());
export const showMessageDialog = createAction('[Shared] Show Message Dialog', props<IMessageDialogData>());
export const showWarningDialog = createAction('[Shared] Show Warning Dialog', props<IWarningDialogData>());
