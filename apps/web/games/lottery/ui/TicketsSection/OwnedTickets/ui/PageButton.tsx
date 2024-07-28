import { motion } from 'framer-motion';
import { cn } from '@/lib/helpers';

export default function PageButton({
  text,
  symbol,
  onClick,
  disabled,
  className,
}: {
  text: string;
  symbol: string;
  onClick: () => void;
  disabled: boolean;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative flex h-[13.53vw] cursor-pointer flex-row rounded-[2.604vw] bg-middle-accent p-[0.33vw] disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      whileHover={!disabled ? { scale: 1.05 } : { scale: 1 }}
      disabled={disabled}
    >
      <div
        className={
          'flex h-full w-full flex-col justify-between rounded-[2.604vw] border p-1'
        }
      >
        <div
          className={
            'my-auto flex h-[8vw] w-full flex-row items-center justify-center gap-1'
          }
        >
          <div className={'h-[8vw] w-[90%] flex-col-reverse justify-between'}>
            <span
              className={
                'w-full rotate-180 font-plexsans text-[1vw] font-medium uppercase [writing-mode:vertical-rl]'
              }
            >
              {text}
            </span>
          </div>
        </div>
        <div className={'flex w-full items-center justify-center p-1'}>
          <div
            className={
              'flex min-h-[1.41vw] min-w-[1.41vw] items-center justify-center rounded-full bg-[#F9F8F4] text-[0.8vw] uppercase text-black'
            }
          >
            {symbol}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
