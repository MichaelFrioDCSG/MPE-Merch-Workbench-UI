export interface IWarningDialogData {
  title: string;
  height?: string;
  width?: string;
  messages: string[];
  action: string;
  okAction?: () => void;
}
