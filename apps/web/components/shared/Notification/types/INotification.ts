import { NotificationType } from './notificationType';

export interface INotification {
  id: string;
  type: NotificationType;
  message: string;
  isDismissible: boolean;
  dismissAfterDelay?: boolean;
  dismissDelay?: number;
}
