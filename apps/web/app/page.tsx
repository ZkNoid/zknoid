'use client';

import 'reflect-metadata';
import Footer from '@/components/widgets/Footer/Footer';
import MainSection from '@/components/pages/MainSection';
import Header from '@/components/widgets/Header';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';

export default function Home() {
  return (
    <ZkNoidGameContext.Provider
      value={{
        client: undefined,
        appchainSupported: false,
        buildLocalClient: true,
      }}
    >
      <div className="flex min-h-screen flex-col">
        <Header />

        <MainSection />

        <Footer />
      </div>
    </ZkNoidGameContext.Provider>
  );
}
