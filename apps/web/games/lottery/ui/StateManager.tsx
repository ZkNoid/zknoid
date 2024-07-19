import { useWorkerClientStore } from '@/lib/stores/workerClient';
import Loader from '@/components/shared/Loader';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/helpers';

export default function StateManager() {
  const workerClientStore = useWorkerClientStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [loadedMsg, setLoadedMsg] = useState<string | undefined>();

  useEffect(() => {
    if (workerClientStore.lotteryCompiled && isLoading) {
      setLoadedMsg(workerClientStore.status);
      setIsLoading(false);
    }
  }, [workerClientStore.lotteryCompiled]);

  useEffect(() => {
    if (!isLoading && isOpen) {
      setTimeout(() => setIsOpen(false), 10000);
    }
  }, [isLoading]);

  return (
    <div
      className={cn(
        'fixed bottom-[2.5%] left-[38%] right-[38%] z-30 flex cursor-pointer items-center justify-center rounded-[0.521vw] bg-[#323232] p-[1.042vw] shadow-2xl hover:bg-[#3f3f3f]',
        { hidden: !isOpen }
      )}
      onClick={() => setIsOpen(false)}
    >
      <span
        className={'flex flex-row items-center justify-center gap-[0.521vw]'}
      >
        <AnimatePresence>
          {isLoading ? (
            <Loader size={19} color={'#D2FF00'} />
          ) : (
            <motion.div
              className={
                'relative cursor-pointer rounded-[5px] border p-1 hover:opacity-80'
              }
              variants={{
                default: { borderColor: '#F9F8F4', backgroundColor: '#212121' },
                active: { borderColor: '#D2FF00', backgroundColor: '#D2FF00' },
                error: { borderColor: '#FF0000' },
              }}
              animate={'active'}
              transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            >
              <motion.svg
                aria-hidden="true"
                role="presentation"
                viewBox="0 0 17 18"
                className={'h-3.5 w-3.5'}
              >
                <motion.polyline
                  fill="none"
                  points="1 9 7 14 15 4"
                  stroke="#252525"
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
            </motion.div>
          )}
        </AnimatePresence>
        <span
          className={
            'text-pretty text-center font-plexsans text-[0.938vw] font-medium text-foreground'
          }
        >
          {loadedMsg || workerClientStore.status}
        </span>
      </span>
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
    </div>
  );
}
