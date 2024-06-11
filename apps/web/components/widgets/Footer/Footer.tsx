import Link from 'next/link';
import Image from 'next/image';
import zknoidLogo from '@/public/image/zknoid-logo.svg';
import { SOCIALS } from '@/constants/socials';

export default function Footer() {
  return (
    <div
      className={'mx-6 mb-10 mt-[100px] flex flex-col justify-between gap-4'}
    >
      <div className={'grid grid-cols-3 grid-rows-2 gap-4 lg:grid-rows-1'}>
        <Link
          href={'/'}
          target="_blank"
          rel="noopener noreferrer"
          className={
            'col-start-1 col-end-4 cursor-pointer ease-in-out hover:opacity-80'
          }
        >
          <Image src={zknoidLogo} alt={'ZkNoid Logo'} />
        </Link>
        <div
          className={
            'col-start-1 col-end-4 grid grid-cols-2 grid-rows-2 flex-row items-center justify-center gap-x-4 gap-y-1 self-center lg:flex'
          }
        >
          <Link
            className="cursor-pointer text-buttons-menu ease-in-out hover:opacity-80 lg:even:text-right"
            href={'https://zknoid.io'}
            target="_blank"
            rel="noopener noreferrer"
          >
            About us
          </Link>
          <Link
            className="cursor-pointer text-buttons-menu ease-in-out hover:opacity-80 lg:even:text-right"
            href={'https://github.com/ZkNoid'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </Link>
          <Link
            className="cursor-pointer text-buttons-menu ease-in-out hover:opacity-80 lg:even:text-right"
            href={'https://zknoid.medium.com'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </Link>
          <Link
            className="cursor-pointer text-buttons-menu ease-in-out hover:opacity-80 lg:even:text-right"
            href={'https://docs.zknoid.io'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </Link>
        </div>
      </div>
      <div
        className={
          'grid grid-cols-3 grid-rows-2 gap-y-8 lg:grid-rows-1 lg:gap-y-0'
        }
      >
        <div className="col-start-1 col-end-4 flex gap-3">
          {SOCIALS.map((x) => (
            <Link href={x.link} key={x.id}>
              <Image alt={x.name} src={x.whiteImage} />
            </Link>
          ))}
        </div>
        <div
          className={
            'col-start-1 col-end-4 row-start-2 font-mono text-[12px]/[12px] font-light lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:text-end lg:text-[14px]/[17px]'
          }
        >
          © 2024 ZkNoid: all rights reserved
        </div>
      </div>
    </div>
  );
}
