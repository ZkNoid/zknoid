import { MouseEventHandler, ReactNode } from 'react';

export function TicketBlockButton({
  children,
  onClick = undefined,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}) {
  return (
    <div
      className="flex h-[1.6vw] cursor-pointer items-center justify-center rounded-[0.33vw] bg-bg-dark p-[0.33vw] hover:opacity-80"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
