import { ReactNode } from 'react';
import { clsx } from 'clsx';

export const GameWrap = ({
  children,
  noBorder,
}: {
  children: ReactNode;
  noBorder?: boolean;
}) => {
  return (
    <div
      className={clsx(
        'flex min-h-[60vh] w-full flex-col items-center justify-center rounded-[5px]',
        { 'border-2 border-foreground/50': !noBorder }
      )}
    >
      {children}
    </div>
  );
};
