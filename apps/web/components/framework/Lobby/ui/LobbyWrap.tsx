import { ReactNode } from 'react';

export const LobbyWrap = ({ children }: { children: ReactNode }) => {
  return <div className={'grid grid-cols-5 gap-4'}>{children}</div>;
};
