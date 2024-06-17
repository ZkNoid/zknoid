import { MouseEventHandler, ReactNode } from 'react';
import { cn } from '@/lib/helpers';

export function VioletLotteryButton({
  children,
  className,
  onClick = undefined,
}: {
  children: ReactNode;
  className: string;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-[0.67vw] border-bg-dark bg-right-accent text-bg-dark',
        className
      )}
    >
      {children}
    </div>
  );
}
