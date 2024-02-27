import { ReactNode } from 'react';

export default function AsyncLayout({ children }: { children: ReactNode }) {
  return (
    <div className={'flex min-h-screen flex-col'}>
      {children}
      {/* <Toaster /> */}
    </div>
  );
}
