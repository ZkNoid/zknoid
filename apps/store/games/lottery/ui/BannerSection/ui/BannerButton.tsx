import { MouseEventHandler, ReactNode } from 'react';
import { cn } from '@/lib/helpers';

export default function BannerButton({
  children,
  className,
  onClick = undefined,
  disabled = undefined,
}: {
  children: ReactNode;
  className: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <button
      className={cn(
        'cursor-pointer rounded-[0.33vw] border hover:opacity-80 disabled:opacity-60',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
