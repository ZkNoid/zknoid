import { cn } from '@/lib/helpers';
import { MouseEventHandler, ReactNode } from 'react';

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

export function TicketBlockButton({
  children,
  onClick = undefined,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}) {
  return (
    <div className="flex h-[1.6vw] items-center justify-center rounded-[0.33vw] bg-bg-dark p-[0.33vw] cursor-pointer" onClick={onClick}>
      {children}
    </div>
  );
}
