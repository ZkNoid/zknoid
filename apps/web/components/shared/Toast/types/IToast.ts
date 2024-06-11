import { ReactNode } from 'react';

export enum ToastTypes {
  Success,
  Error,
  Warning,
  Info,
}

export interface IToast {
  id: number;
  type: ToastTypes;
  content: ReactNode;
}
