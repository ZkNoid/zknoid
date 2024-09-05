import { ReactNode } from 'react';

export interface INotification {
  id: string;
  type: 'message' | 'loader' | 'success' | 'error';
  message: string;
  customIcon?: any;
  isDismissible: boolean;
  dismissAfterDelay?: boolean;
  dismissDelay?: number;
}
