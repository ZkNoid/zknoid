import Link from 'next/link';
import Image from 'next/image';
import zknoidLogo from '@/public/image/zknoid-logo.svg';
import { SOCIALS } from '@/constants/socials';

export default function Footer() {
  return (
    <div
      className={
        'mx-[2.604vw] mb-[2.604vw] mt-[5.208vw] flex flex-col justify-between gap-[0.833vw]'
      }
    >
      <div
        className={'grid grid-cols-3 grid-rows-2 gap-[0.833vw] lg:grid-rows-1'}
      >
        <Link
          href={'/'}
          target="_blank"
          rel="noopener noreferrer"
          className={
            'col-start-1 col-end-4 w-fit cursor-pointer ease-in-out hover:opacity-80'
          }
        >
          <Image
            src={zknoidLogo}
            alt={'ZkNoid Logo'}
            className={'h-full w-[11.458vw]'}
          />
        </Link>
        <div
          className={
            'col-start-1 col-end-4 grid grid-cols-2 grid-rows-2 flex-row items-center justify-center gap-x-[0.833vw] gap-y-[0.208vw] self-center lg:flex'
          }
        >
          <Link
            className="cursor-pointer font-museo text-[0.833vw] font-medium ease-in-out hover:opacity-80 lg:even:text-right"
            href={'https://zknoid.io'}
            target="_blank"
            rel="noopener noreferrer"
          >
            About us
          </Link>
          <Link
            className="cursor-pointer font-museo text-[0.833vw] font-medium ease-in-out hover:opacity-80 lg:even:text-right"
            href={'https://github.com/ZkNoid'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </Link>
          <Link
            className="cursor-pointer font-museo text-[0.833vw] font-medium ease-in-out hover:opacity-80 lg:even:text-right"
            href={'https://zknoid.medium.com'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </Link>
          <Link
            className="cursor-pointer font-museo text-[0.833vw] font-medium ease-in-out hover:opacity-80 lg:even:text-right"
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
          'grid grid-cols-3 grid-rows-2 gap-y-[1.667vw] lg:grid-rows-1 lg:gap-y-0'
        }
      >
        <div className="col-start-1 col-end-4 flex gap-[0.625vw]">
          {SOCIALS.map((x) => (
            <Link
              href={x.link}
              key={x.id}
              className={'flex items-center justify-center hover:opacity-80'}
            >
              <Image
                alt={x.name}
                src={x.whiteImage}
                className={'h-[1.25vw] w-[1.25vw]'}
              />
            </Link>
          ))}
        </div>
        <div
          className={
            'col-start-1 col-end-4 row-start-2 font-mono text-[0.625vw] font-light lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:text-end lg:text-[0.729vw]'
          }
        >
          © 2024 ZkNoid: all rights reserved
        </div>
      </div>
    </div>
  );
}
