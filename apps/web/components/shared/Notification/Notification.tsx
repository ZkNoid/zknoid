import { cn } from '@/lib/helpers';
import { motion } from 'framer-motion';
import { INotification } from './types/INotification';
import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';
import Loader from '../Loader';
import Image from 'next/image';

export default function Notification({
  notification,
}: {
  notification: INotification;
}) {
  const notificationStore = useNotificationStore();

  if (notification.dismissAfterDelay) {
    setTimeout(
      () => notificationStore.remove(notification.id),
      notification.dismissDelay
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 1000 }}
      layout={'position'}
      className={cn(
        'relative flex items-center justify-center rounded-[0.521vw] bg-[#323232] p-[1.042vw] shadow-2xl',
        { 'cursor-pointer hover:bg-[#3f3f3f]': notification.isDismissible }
      )}
      onClick={() => {
        notification.isDismissible
          ? notificationStore.remove(notification.id)
          : undefined;
      }}
    >
      <span className={'flex w-full flex-row items-center gap-[0.521vw]'}>
        {notification.customIcon ? (
          <Image
            src={notification.customIcon}
            alt={'notificationIcon'}
            className={'h-[1vw] w-[1vw]'}
          />
        ) : (
          <>
            {notification.type === 'loader' && (
              <Loader size={19} color={'#D2FF00'} />
            )}
            {notification.type === 'success' && (
              <motion.div
                className={
                  'relative cursor-pointer rounded-[5px] border p-1 hover:opacity-80'
                }
                variants={{
                  default: {
                    borderColor: '#F9F8F4',
                    backgroundColor: '#212121',
                  },
                  active: {
                    borderColor: '#D2FF00',
                    backgroundColor: '#D2FF00',
                  },
                  error: { borderColor: '#FF0000' },
                }}
                animate={'active'}
                transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              >
                <svg
                  aria-hidden="true"
                  role="presentation"
                  viewBox="0 0 17 18"
                  className={'h-[0.729vw] w-[0.729vw]'}
                >
                  <polyline
                    fill="none"
                    points="1 9 7 14 15 4"
                    stroke="#252525"
                    strokeDasharray="22"
                    strokeDashoffset="44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </motion.div>
            )}
            {notification.type === 'error' && (
              <motion.div
                className={
                  'relative cursor-pointer rounded-[5px] border p-1 hover:opacity-80'
                }
                variants={{
                  default: {
                    borderColor: '#F9F8F4',
                    backgroundColor: '#212121',
                  },
                  active: {
                    borderColor: '#D2FF00',
                    backgroundColor: '#D2FF00',
                  },
                  error: { borderColor: '#FF0000', backgroundColor: '#FF0000' },
                }}
                animate={'error'}
                transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              >
                <svg
                  width="0.625vw"
                  height="0.625vw"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={'h-[0.729vw] w-[0.729vw]'}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.0904 6.00256L12 1.09091L10.9095 0L5.99995 4.91165L1.09045 0.000102644L0 1.09101L4.90949 6.00256L0.00499294 10.9091L1.09545 12L5.99995 7.09347L10.9045 12.0001L11.995 10.9092L7.0904 6.00256Z"
                    fill="#212121"
                  />
                </svg>
              </motion.div>
            )}
          </>
        )}
        <div
          className={
            'h-full w-full font-plexsans text-[0.938vw] font-medium text-foreground'
          }
        >
          {notification.message}
        </div>
      </span>
      {notification.isDismissible && (
        <svg
          width="0.625vw"
          height="0.625vw"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={'absolute right-[3%] top-[10%] h-[0.625vw] w-[0.625vw]'}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.0904 6.00256L12 1.09091L10.9095 0L5.99995 4.91165L1.09045 0.000102644L0 1.09101L4.90949 6.00256L0.00499294 10.9091L1.09545 12L5.99995 7.09347L10.9045 12.0001L11.995 10.9092L7.0904 6.00256Z"
            fill="#4b4b4b"
          />
        </svg>
      )}
    </motion.div>
  );
}
