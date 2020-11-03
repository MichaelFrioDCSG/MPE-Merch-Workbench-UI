import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { WarningDialogComponent } from '../components';
import { MessageDialogComponent } from '../components/message-dialog/message-dialog.component';
import { ToastMessageComponent } from '../components/toast-message/toast-message.component';

import * as actions from './actions';

@Injectable()
export default class SharedEffects {
  constructor(private actions$: Actions, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  private onShowNotificaion = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.showNotificaion),
        tap(action => {
          const snackBarRef = this.snackBar.openFromComponent(ToastMessageComponent, {
            data: {
              title: action.title,
              messages: action.messages,
              isError: action.isError,
            },
          });

          snackBarRef.onAction().subscribe(() => this.snackBar.dismiss());
        })
      ),
    {
      dispatch: false,
    }
  );

  private onShowMessageDialog = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.showMessageDialog),
        tap(action => {
          const dialogRef = this.dialog.open(MessageDialogComponent, {
            width: '50%',
            data: { messages: action.messages },
          });

          dialogRef.afterClosed().subscribe(() => {
            dialogRef.close();
          });
        })
      ),
    {
      dispatch: false,
    }
  );

  private onShowWarningDialog = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.showWarningDialog),
        tap(action => {
          const dialogRef = this.dialog.open(WarningDialogComponent, {
            width: action.width || '50%',
            height: action.height || '',
            data: { messages: action.messages, title: action.title, action: action.action },
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result && action.okAction) {
              action.okAction();
            }
            dialogRef.close();
          });
        })
      ),
    {
      dispatch: false,
    }
  );
}
