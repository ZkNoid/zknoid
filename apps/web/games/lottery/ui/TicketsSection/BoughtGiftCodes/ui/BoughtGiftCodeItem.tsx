import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function BoughtGiftCodeItem({ code }: { code: string }) {
  const notificationStore = useNotificationStore();
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const copyCodes = (giftCode: string | string[]) => {
    const codes = giftCode.toString().replaceAll(',', ', ');
    navigator.clipboard.writeText(codes);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
    notificationStore.create({
      type: 'success',
      message: 'Copied!',
    });
  };

  return (
    <button
      className={
        'flex w-full cursor-pointer flex-row gap-[0.26vw] hover:opacity-80'
      }
      onClick={() => copyCodes(code)}
    >
      <div
        className={
          'w-full rounded-[0.26vw] border border-foreground p-[0.26vw] text-start font-plexsans text-[0.729vw]'
        }
      >
        {code}
      </div>
      <AnimatePresence>
        {linkCopied ? (
          <div
            className={
              'flex items-center justify-center rounded-[0.26vw] border border-foreground p-[0.26vw]'
            }
          >
            <motion.svg
              aria-hidden="true"
              role="presentation"
              viewBox="0 0 17 18"
              className={'h-[1.25vw] w-[1.25vw]'}
            >
              <motion.polyline
                fill="none"
                points="1 9 7 14 15 4"
                stroke="#F9F8F4"
                strokeDasharray="22"
                strokeDashoffset="44"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
              />
            </motion.svg>
          </div>
        ) : (
          <div
            className={
              'flex items-center justify-center rounded-[0.26vw] border border-foreground p-[0.26vw]'
            }
          >
            <svg
              width="14"
              height="17"
              viewBox="0 0 14 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={'h-[1.25vw] w-[1.25vw]'}
            >
              <path
                d="M7.7 14.0965C8.62792 14.0954 9.51751 13.7283 10.1736 13.0757C10.8298 12.4231 11.1989 11.5383 11.2 10.6154V4.51846C11.2011 4.15249 11.1291 3.78995 10.9883 3.45185C10.8475 3.11374 10.6406 2.8068 10.3796 2.54882L8.8102 0.98787C8.55082 0.728297 8.24222 0.522511 7.90229 0.382442C7.56235 0.242372 7.19785 0.170804 6.8299 0.171887H3.5C2.57208 0.172993 1.68249 0.540111 1.02635 1.19272C0.370217 1.84532 0.0011115 2.73012 0 3.65304V10.6154C0.0011115 11.5383 0.370217 12.4231 1.02635 13.0757C1.68249 13.7283 2.57208 14.0954 3.5 14.0965H7.7ZM1.4 10.6154V3.65304C1.4 3.09909 1.62125 2.56782 2.01508 2.17611C2.4089 1.78441 2.94305 1.56435 3.5 1.56435C3.5 1.56435 6.9433 1.5741 7 1.58106V2.95681C7 3.32612 7.1475 3.6803 7.41005 3.94143C7.6726 4.20257 8.0287 4.34928 8.4 4.34928H9.7832C9.7902 4.40567 9.8 10.6154 9.8 10.6154C9.8 11.1693 9.57875 11.7006 9.18492 12.0923C8.7911 12.484 8.25695 12.7041 7.7 12.7041H3.5C2.94305 12.7041 2.4089 12.484 2.01508 12.0923C1.62125 11.7006 1.4 11.1693 1.4 10.6154ZM14 5.74174V13.4003C13.9989 14.3232 13.6298 15.208 12.9736 15.8606C12.3175 16.5132 11.4279 16.8803 10.5 16.8814H4.2C4.01435 16.8814 3.8363 16.8081 3.70503 16.6775C3.57375 16.547 3.5 16.3699 3.5 16.1852C3.5 16.0006 3.57375 15.8235 3.70503 15.6929C3.8363 15.5623 4.01435 15.489 4.2 15.489H10.5C11.057 15.489 11.5911 15.2689 11.9849 14.8772C12.3788 14.4855 12.6 13.9542 12.6 13.4003V5.74174C12.6 5.55709 12.6737 5.38 12.805 5.24943C12.9363 5.11886 13.1143 5.04551 13.3 5.04551C13.4857 5.04551 13.6637 5.11886 13.795 5.24943C13.9263 5.38 14 5.55709 14 5.74174Z"
                fill="#F9F8F4"
              />
            </svg>
          </div>
        )}
      </AnimatePresence>
    </button>
  );
}
