import { MouseEventHandler, ReactNode } from 'react';
import { cn } from '@/lib/helpers';

export function GreenLotteryButton({
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
      className={cn(
        'cursor-pointer rounded-[0.33vw] border border-left-accent text-left-accent',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
