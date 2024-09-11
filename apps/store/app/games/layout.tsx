import { ReactNode } from 'react';
import Header from '@sdk/components/widgets/Header';
import Footer from '@sdk/components/widgets/Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
