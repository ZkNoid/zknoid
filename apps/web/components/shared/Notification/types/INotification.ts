export interface INotification {
  id: string;
  type: 'message' | 'loader' | 'success' | 'error';
  message: string;
  isDismissible: boolean;
  dismissAfterDelay?: boolean;
  dismissDelay?: number;
}
