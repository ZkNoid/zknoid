'use client';

import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';
import Notification from '@/components/shared/Notification/Notification';
import { AnimatePresence } from 'framer-motion';

export default function NotificationsContainer() {
  const notificationStore = useNotificationStore();
  return (
    <div className="fixed bottom-[2.5%] right-12 z-30 flex h-fit flex-col-reverse gap-[0.521vw]">
      <AnimatePresence>
        {notificationStore.notifications.length > 0 &&
          notificationStore.notifications.map((item) => (
            <Notification key={item.id} notification={item} />
          ))}
      </AnimatePresence>
    </div>
  );
}
