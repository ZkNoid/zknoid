'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatAddress, walletInstalled } from '@/lib/helpers';
import { useNetworkStore } from '@/lib/stores/network';
import HeaderCard from '../entities/HeaderCard/HeaderCard';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';
import AccountCard from './ui/AccountCard';
import AccountPopup from './AccountPopup';
import { AnimatePresence } from 'framer-motion';
import Tab from './ui/Tab';
import boardGameIcon from '@/public/image/misc/board-game-icon.svg';
import arcadeGameIcon from '@/public/image/misc/arcade-game-icon.svg';
import luckyGameIcon from '@/public/image/misc/lucky-game-icon.svg';
import { SOCIALS } from '@/constants/socials';

const Balance = dynamic(() => import('./nonSSR/Balance'), {
  ssr: false,
});

const NetworkPicker = dynamic(
  () => import('../nonSSR/NetworkPicker/NetworkPicker'),
  {
    ssr: false,
  }
);

export default function DesktopNavbar({
  autoconnect,
}: {
  autoconnect: boolean;
}) {
  const networkStore = useNetworkStore();
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!walletInstalled()) return;

    if (autoconnect) {
      networkStore.connectWallet(true);
    }
  }, []);
  const logWalletConnectedMutation =
    api.logging.logWalletConnected.useMutation();

  useEffect(() => {
    if (networkStore.walletConnected) {
      logWalletConnectedMutation.mutate({
        userAddress: networkStore.address ?? '',
        envContext: getEnvContext(),
      });
    }
  }, [networkStore.walletConnected]);

  return (
    <header className="sticky top-0 z-50 hidden h-[91px] w-full items-center bg-bg-dark px-3 lg:flex lg:px-[50px]">
      <div className={'flex w-full items-center justify-between'}>
        <Link
          href={'/'}
          className={'cursor-pointer ease-in-out hover:opacity-80'}
        >
          <Image
            src={'/image/zknoid-logo.svg'}
            alt={'ZkNoid logo'}
            width={219}
            height={47}
          />
        </Link>
        <div
          className={'flex flex-row items-center justify-between py-[0.33vw]'}
        >
          <Tab
            title={'Games'}
            link={'/#games'}
            items={[
              {
                icon: (
                  <Image
                    src={arcadeGameIcon}
                    alt={'arcade'}
                    className={'h-[0.938vw] w-[0.938vw] pb-[0.208vw]'}
                  />
                ),
                text: 'Arkanoid',
                link: '/games/arkanoid/global',
              },
              {
                icon: (
                  <Image
                    src={boardGameIcon}
                    alt={'board'}
                    className={'h-[0.938vw] w-[0.938vw] pb-[0.208vw]'}
                  />
                ),
                text: 'Randzu',
                link: '/games/randzu/global',
              },
              {
                icon: (
                  <Image
                    src={luckyGameIcon}
                    alt={'lucky'}
                    className={'h-[0.938vw] w-[0.938vw] pb-[0.208vw]'}
                  />
                ),
                text: 'Thimblerig',
                link: '/games/thimblerig/global',
              },
              {
                icon: (
                  <Image
                    src={boardGameIcon}
                    alt={'board'}
                    className={'h-[0.938vw] w-[0.938vw] pb-[0.208vw]'}
                  />
                ),
                text: 'Checkers',
                link: '/games/checkers/global',
              },
              {
                icon: (
                  <Image
                    src={arcadeGameIcon}
                    alt={'arcade'}
                    className={'h-[0.938vw] w-[0.938vw] pb-[0.208vw]'}
                  />
                ),
                text: 'TileVille',
                link: 'https://www.tileville.xyz/',
              },
              {
                icon: (
                  <Image
                    src={luckyGameIcon}
                    alt={'lucky'}
                    className={'h-[0.938vw] w-[0.938vw] pb-[0.208vw]'}
                  />
                ),
                text: 'Lottery',
                link: '/games/lottery/global',
              },
            ]}
          />
          <Tab title={'Events'} link={'/#events'} />
          <Tab title={'FAQ & Support'} link={'/#faq'} />
          <Tab
            title={'Media'}
            link={'/#faq'}
            items={Array.from(
              SOCIALS.map((item) => ({
                icon: (
                  <Image
                    src={item.image}
                    alt={item.name}
                    className={'h-[1.2vw] w-[1.2vw] pb-[0.208vw]'}
                  />
                ),
                link: item.link,
                text: item.name,
              }))
            )}
          />
        </div>

        <div className="relative flex gap-5">
          {networkStore.walletConnected && networkStore.address ? (
            <>
              <Balance network={'L1'} />
              <AccountCard
                text={formatAddress(networkStore.address)}
                onClick={() => setIsAccountOpen(true)}
              />
              <NetworkPicker />
              <AnimatePresence>
                {isAccountOpen && (
                  <AccountPopup setIsAccountOpen={setIsAccountOpen} />
                )}
              </AnimatePresence>
            </>
          ) : walletInstalled() ? (
            <HeaderCard
              svg={'account'}
              text="Connect wallet"
              isMiddle={true}
              onClick={() => {
                networkStore.connectWallet(false);
              }}
            />
          ) : (
            <Link
              href="https://www.aurowallet.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <HeaderCard
                svg={'account'}
                text="Install wallet"
                isMiddle={true}
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
