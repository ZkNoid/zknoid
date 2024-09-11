import { ReactNode } from 'react';
import Header from '@zknoid/sdk/components/widgets/Header';
import Footer from '@zknoid/sdk/components/widgets/Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
