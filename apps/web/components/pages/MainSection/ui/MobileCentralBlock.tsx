import { SOCIALS } from '@/constants/socials';
import Link from 'next/link';
import Image from 'next/image';

export default function MobileCentralBlock() {
  return (
    <div
      className={
        'my-12 flex w-full items-center justify-center gap-4 rounded-[10px] border border-left-accent px-2 py-4 lg:hidden'
      }
    >
      {SOCIALS.map((x) => (
        <Link href={x.link} key={x.id} className={'hover:opacity-80'}>
          <Image alt={x.name} src={x.image} />
        </Link>
      ))}
    </div>
  );
}
