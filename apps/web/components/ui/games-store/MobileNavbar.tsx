'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { walletInstalled } from '@/lib/helpers';
import { useNetworkStore } from '@/lib/stores/network';
import { HeaderCard } from './HeaderCard';
import {
  AnimatePresence,
  motion,
  useCycle,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { SOCIALS } from '@/constants/socials';

const BalanceInfo = dynamic(
  () => import('@/components/ui/games-store/BalanceInfo'),
  {
    ssr: false,
  }
);

const NetworkPicker = dynamic(() => import('@/components/NetworkPicker'), {
  ssr: false,
});

export const MobileNavbar = ({ autoconnect }: { autoconnect: boolean }) => {
  const [hidden, setHidden] = useState(false);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const networkStore = useNetworkStore();

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
          className={'cursor-pointer ease-in-out hover:opacity-80'}
        >
          <Image
            src={'/image/zknoid-logo.svg'}
            alt={'ZkNoid logo'}
            width={219}
            height={47}
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
              },
            }}
            className="block h-[3px] w-[30px] bg-[#fff]"
          ></motion.span>
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
          ></motion.span>
          <motion.span
            variants={{
              hide: {
                rotate: 0,
              },
              show: {
                rotate: -45,
                y: -9,
              },
            }}
            className="block h-[3px] w-[30px] bg-[#fff]"
          ></motion.span>
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
              className={
                'container fixed inset-y-0 mx-auto flex flex-row justify-end md:mr-0'
              }
            >
              <div
                className={
                  'z-50 flex h-screen w-full flex-col gap-4 bg-bg-dark px-4 pb-4 pt-[80px] text-xl'
                }
              >
                <div className="flex flex-col gap-2">
                  {networkStore.walletConnected && networkStore.address ? (
                    <>
                      <HeaderCard
                        svg={'account'}
                        isMiddle={true}
                        text={networkStore.address!.substring(0, 10) + '..'}
                      />
                      <NetworkPicker />
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
                  {networkStore.walletConnected && <BalanceInfo />}
                  <div className="mt-6 flex justify-center gap-3">
                    {SOCIALS.map((x) => (
                      <Link href={x.link} key={x.id}>
                        <Image alt={x.name} src={x.image} />
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
};
