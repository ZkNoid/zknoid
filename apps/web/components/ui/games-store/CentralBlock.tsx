import Image from 'next/image';
import Link from 'next/link';

import { SOCIALS } from '@/constants/socials';

import centralBlockImg from '@/public/image/central-block.svg';
import bookImg from '@/public/image/misc/book.svg';
import webImg from '@/public/image/misc/web.svg';

export const CentralBlock = () => (
  <div className="relative flex w-[50%] self-end text-[24px]">
    <Image alt="central block" src={centralBlockImg} className="w-full"></Image>
    <div className="absolute flex h-full w-full items-center justify-around">
      <Link href={'https://docs.zknoid.io/docs'} className="flex gap-2">
        <Image alt="Book" src={bookImg} />
        Docs
      </Link>
      <Link href={'https://zknoid.io'} className="flex gap-2">
        <Image src={webImg} alt="Web" />
        About us
      </Link>
      <div className="flex gap-3">
        {SOCIALS.map((x) => (
          <Link href={x.link} key={x.id}>
            <Image alt={x.name} src={x.image}></Image>
          </Link>
        ))}
      </div>
    </div>
  </div>
);
