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
import {
  AnimatePresence,
  motion,
  useCycle,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import Tab from './ui/Tab';
import boardGameIcon from '@/public/image/misc/board-game-icon.svg';
import arcadeGameIcon from '@/public/image/misc/arcade-game-icon.svg';
import luckyGameIcon from '@/public/image/misc/lucky-game-icon.svg';
import { SOCIALS } from '@/constants/socials';

const Balance = dynamic(() => import('./nonSSR/DesktopBalanceInfo'), {
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
  const [networkExpanded, setNetworkExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const networkStore = useNetworkStore();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    // @ts-ignore
    if (latest > previous && latest > 200 && !isOpen) {
      setHidden(true);
    } else if (
      // @ts-ignore
      (isOpen && latest - previous >= 100) ||
      // @ts-ignore
      (previous - latest >= 100 && isOpen)
    ) {
      toggleOpen();
    } else setHidden(false);
  });
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

  useEffect(() => {
    if (hidden) {
      setIsAccountOpen(false);
      setNetworkExpanded(false);
    }
  }, [hidden]);

  const [isWalletInstalled, setWalletInstalled] = useState(false);

  useEffect(() => {
    setWalletInstalled(walletInstalled());
  }, []);

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-300%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut', type: 'just' }}
      className="sticky top-0 z-50 hidden h-[91px] w-full items-center bg-bg-dark px-3 lg:flex lg:px-[50px]"
    >
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
                    className={'my-[0.208vw] h-[0.938vw] w-[0.938vw]'}
                  />
                ),
                text: 'Arkanoid',
                link: 'https://proto.zknoid.io/games/arkanoid/global',
              },
              {
                icon: (
                  <Image
                    src={boardGameIcon}
                    alt={'board'}
                    className={'my-[0.208vw] h-[0.938vw] w-[0.938vw]'}
                  />
                ),
                text: 'Randzu',
                link: 'https://proto.zknoid.io/games/randzu/global',
              },
              {
                icon: (
                  <Image
                    src={luckyGameIcon}
                    alt={'lucky'}
                    className={'my-[0.208vw] h-[0.938vw] w-[0.938vw]'}
                  />
                ),
                text: 'Thimblerig',
                link: 'https://proto.zknoid.io/games/thimblerig/global',
              },
              {
                icon: (
                  <Image
                    src={boardGameIcon}
                    alt={'board'}
                    className={'my-[0.208vw] h-[0.938vw] w-[0.938vw]'}
                  />
                ),
                text: 'Checkers',
                link: 'https://proto.zknoid.io/games/checkers/global',
              },
              {
                icon: (
                  <Image
                    src={arcadeGameIcon}
                    alt={'arcade'}
                    className={'my-[0.208vw] h-[0.938vw] w-[0.938vw]'}
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
                    className={'my-[0.208vw] h-[0.938vw] w-[0.938vw]'}
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
                    className={'my-[0.208vw] h-[1.2vw] w-[1.2vw]'}
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
              <Balance />
              <AccountCard
                text={formatAddress(networkStore.address)}
                onClick={() => setIsAccountOpen(true)}
              />
              <NetworkPicker
                expanded={networkExpanded}
                setExpanded={setNetworkExpanded}
              />
              <AnimatePresence>
                {isAccountOpen && (
                  <AccountPopup setIsAccountOpen={setIsAccountOpen} />
                )}
              </AnimatePresence>
            </>
          ) : isWalletInstalled ? (
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
    </motion.header>
  );
}
