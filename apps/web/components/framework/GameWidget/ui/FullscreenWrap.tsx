import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import LoadSpinner from '@/components/shared/LoadSpinner';

export const FullscreenWrap = ({
  isFullscreen,
  children,
}: {
  isFullscreen: boolean;
  children: ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <>
      <motion.div
        animate={isFullscreen ? 'fullscreen' : 'windowed'}
        initial={false}
        variants={{
          fullscreen: {
            gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
            gap: '5rem',
          },
          windowed: {
            gridTemplateRows: 'repeat(1, minmax(0, 1fr))',
          },
        }}
        className={
          'flex grid-cols-4 flex-col-reverse gap-4 pt-10 lg:grid lg:pt-0'
        }
        onAnimationStart={() => setIsLoading(true)}
        onAnimationComplete={() => setIsLoading(false)}
      >
        {children}
      </motion.div>
      <AnimatePresence initial={false}>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              'fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center backdrop-blur-md'
            }
          >
            <LoadSpinner width={50} height={50} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
