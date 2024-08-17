'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn, walletInstalled } from '@/lib/helpers';
import { useNetworkStore } from '@/lib/stores/network';
import HeaderCard from '../entities/HeaderCard';
import {
  AnimatePresence,
  motion,
  useCycle,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { SOCIALS } from '@/constants/socials';
import MobileAccount from '@/components/widgets/Header/MobileNavbar/ui/MobileAccount';
import { useBridgeStore } from '@/lib/stores/bridgeStore';

const MobileBalanceInfo = dynamic(() => import('./nonSSR/MobileBalanceInfo'), {
  ssr: false,
});


const NetworkPicker = dynamic(
  () =>
    import('@/components/widgets/Header/nonSSR/NetworkPicker/NetworkPicker'),
  {
    ssr: false,
  }
);

export default function MobileNavbar({
  autoconnect,
}: {
  autoconnect: boolean;
}) {
  const [networkExpanded, setNetworkExpanded] = useState(false);

  const [hidden, setHidden] = useState(false);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const networkStore = useNetworkStore();
  const bridgeStore = useBridgeStore();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    // @ts-ignore
    if (latest > previous && latest > 150 && !isOpen) {
      setHidden(true);
    } else if (
      // @ts-ignore
      (isOpen && latest - previous >= 20) ||
      // @ts-ignore
      (previous - latest >= 20 && isOpen)
    ) {
      toggleOpen();
    } else setHidden(false);
  });

  useEffect(() => {
    if (!walletInstalled()) return;

    if (autoconnect) {
      networkStore.connectWallet(true);
    }
  }, []);
  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut', type: 'just' }}
      className="sticky top-0 z-50 flex h-[91px] w-full items-center bg-bg-dark px-3 lg:hidden lg:px-[50px]"
    >
      <div className={'flex w-full items-center justify-between px-2'}>
        <Link
          href={'/'}
          className={'z-20 cursor-pointer ease-in-out hover:opacity-80'}
        >
          <Image
            src={'/image/zknoid-logo.svg'}
            alt={'ZkNoid logo'}
            width={219}
            height={47}
            className={'h-[15vw] w-[35vw]'}
          />
        </Link>
        <motion.button
          animate={isOpen ? 'show' : 'hide'}
          onClick={() => toggleOpen()}
          className={`relative z-50 flex flex-col space-y-1.5`}
        >
          <motion.span
            variants={{
              hide: {
                rotate: 0,
              },
              show: {
                rotate: 45,
                y: 9,
                backgroundColor: '#D2FF00',
              },
            }}
            className="block h-[3px] w-[30px] bg-[#fff]"
          />
          <motion.span
            variants={{
              hide: {
                opacity: 1,
                transition: { duration: 0.1 },
              },
              show: {
                opacity: 0,
                transition: { duration: 0.1 },
              },
            }}
            className="block h-[3px] w-[30px] bg-[#fff]"
          />
          <motion.span
            variants={{
              hide: {
                rotate: 0,
              },
              show: {
                rotate: -45,
                y: -9,
                backgroundColor: '#D2FF00',
              },
            }}
            className="block h-[3px] w-[30px] bg-[#fff]"
          />
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={{
                open: {
                  x: '0%',
                  transition: {
                    type: 'spring',
                    bounce: 0.1,
                    duration: 0.35,
                    ease: 'easeInOut',
                  },
                },
                closed: {
                  x: '100%',
                  transition: {
                    type: 'spring',
                    bounce: 0.1,
                    duration: 0.35,
                    ease: 'easeInOut',
                  },
                },
              }}
              initial={'closed'}
              animate={'open'}
              exit={'closed'}
              className={cn(
                'fixed left-0 top-0 flex h-screen w-full flex-row justify-end bg-bg-dark lg:z-0',
                { 'z-[51]': bridgeStore.open }
              )}
            >
              <div
                className={
                  'flex h-full w-full flex-col bg-bg-dark px-4 pb-4 pt-[90px]'
                }
              >
                <div
                  className={cn('flex w-full flex-col gap-2', {
                    'h-full': networkStore.walletConnected,
                  })}
                >
                  {networkStore.walletConnected && networkStore.address ? (
                    <>
                      <MobileAccount />
                      <NetworkPicker
                        expanded={networkExpanded}
                        setExpanded={setNetworkExpanded}
                      />
                    </>
                  ) : walletInstalled() ? (
                    <HeaderCard
                      svg={'account'}
                      text="Connect wallet"
                      isMiddle={true}
                      onClick={() => {
                        networkStore.connectWallet(false);
                      }}
                      className={'py-3'}
                    />
                  ) : (
                    <Link href="https://www.aurowallet.com/">
                      <HeaderCard
                        svg={'account'}
                        text="Install wallet"
                        isMiddle={true}
                        onClick={() => {
                          networkStore.connectWallet(false);
                        }}
                      />
                    </Link>
                  )}
                </div>
                <div
                  className={cn(
                    'flex h-full w-full flex-col items-center gap-2',
                    {
                      'justify-end': networkStore.walletConnected,
                      'justify-start': !networkStore.walletConnected,
                    }
                  )}
                >
                  {networkStore.walletConnected && <MobileBalanceInfo />}
                  <div
                    className={cn('mt-6 flex gap-3', {
                      'justify-center': networkStore.walletConnected,
                      'w-full justify-between gap-3':
                        !networkStore.walletConnected,
                    })}
                  >
                    {SOCIALS.map((x) => (
                      <Link
                        href={x.link}
                        key={x.id}
                        className={cn({
                          'h-[30px] w-[30px]': !networkStore.walletConnected,
                        })}
                      >
                        <Image
                          alt={x.name}
                          src={x.image}
                          className={cn({
                            'w-full': !networkStore.walletConnected,
                          })}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
