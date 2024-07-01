import BaseModal from '@/components/shared/Modal/BaseModal';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import catWifeIMG from '@/public/image/games/lottery/cat-wife.svg';
import Image from 'next/image';

const NetworkSwitchButton = dynamic(
  () => import('./nonSSR/NetworkSwitchButton'),
  {
    ssr: false,
  }
);

export default function WrongNetworkModal() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} isDismissible={false}>
      <div className={'flex max-w-[20vw] flex-col'}>
        <Image
          src={catWifeIMG}
          alt={'catWifeImg'}
          className={'mx-auto h-[10vw] w-auto object-contain object-center'}
        />
        <span
          className={'my-[1vw] text-center font-museo text-[1vw] font-medium'}
        >
          This game only supports Devnet network, in order to play you need to
          switch network
        </span>
        <div className={'flex flex-col gap-[1vw]'}>
          <NetworkSwitchButton />
          <div className={'flex flex-row items-center'}>
            <div className={'h-px w-full bg-neutral-500'} />
            <span className={'px-[0.5vw] text-[0.5vw]'}>or</span>
            <div className={'h-px w-full bg-neutral-500'} />
          </div>
          <Link
            href={'/'}
            className={
              'w-full rounded-[0.26vw] border border-right-accent p-[0.5vw] text-center font-museo text-[0.833vw] font-medium hover:bg-right-accent/10'
            }
          >
            Pick another game
          </Link>
        </div>
      </div>
    </BaseModal>
  );
}
