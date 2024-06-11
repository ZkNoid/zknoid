import Image from 'next/image';
import centralBlockImg from '@/public/image/central-block.svg';
import { clsx } from 'clsx';
import supportImg from '@/public/image/misc/support.svg';
import Link from 'next/link';
import webImg from '@/public/image/misc/web.svg';
import { SOCIALS } from '@/constants/socials';
import { Pages } from '../lib/pages';

export default function CentralBlock({
  page,
  setPage,
}: {
  page: Pages;
  setPage: (page: Pages) => void;
}) {
  return (
    <div className="relative ml-auto hidden w-[50%] self-end text-[24px] lg:flex">
      <Image
        alt="central block"
        src={centralBlockImg}
        className="w-full"
      ></Image>
      <div className="absolute flex h-full w-full items-center justify-around">
        <div
          className={clsx(
            'flex gap-[0.938vw] text-[1.5vw] text-left-accent hover:opacity-80',
            { 'underline underline-offset-[10px]': page === Pages.Support }
          )}
          onClick={() => setPage(Pages.Support)}
        >
          <Image src={supportImg} alt={'Headphones'} />
          <span className={'cursor-pointer'}>FAQ & Support</span>
        </div>
        <Link
          href={'https://zknoid.io'}
          className="flex gap-[0.938vw] text-[1.5vw] text-left-accent hover:opacity-80"
        >
          <Image src={webImg} alt="Web" />
          About us
        </Link>
        <div className="flex gap-3">
          {SOCIALS.map((x) => (
            <Link href={x.link} key={x.id} className={'hover:opacity-80'}>
              <Image alt={x.name} src={x.image} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
