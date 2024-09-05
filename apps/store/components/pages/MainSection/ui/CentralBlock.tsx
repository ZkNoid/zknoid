'use client';

import { SOCIALS } from '@/constants/socials';
import Link from 'next/link';
import Image from 'next/image';
import centralBlockImg from '@/public/image/central-block.svg';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/helpers';

export default function CentralBlock() {
  const searchParams = useSearchParams();
  const widget = searchParams.get('widget');
  return (
    <div className={'flex w-full items-center justify-end'}>
      <div
        className={
          'relative flex h-full w-[45vw] flex-row items-center justify-center gap-[2.396vw] rounded-[1.563vw] py-[1.927vw]'
        }
      >
        <Image
          alt="central block"
          src={centralBlockImg}
          className="absolute right-0 top-0 -z-[1] h-full w-full"
        ></Image>
        <div
          className={'flex flex-row items-center justify-center gap-[1.771vw]'}
        >
          <Link
            href={'/?widget=faq'}
            className={cn(
              'flex cursor-pointer flex-row items-center justify-center gap-[0.781vw] hover:opacity-80',
              {
                'underline decoration-left-accent underline-offset-8':
                  widget == 'faq',
              }
            )}
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={'mb-[0.416vw] mt-[0.208vw] h-[1.25vw] w-[1.25vw]'}
            >
              <path
                d="M12 0.585938C5.3832 0.585938 0 5.96914 0 12.5859V17.5575C0 18.7863 1.0764 19.7859 2.4 19.7859H3.6C3.91826 19.7859 4.22348 19.6595 4.44853 19.4345C4.67357 19.2094 4.8 18.9042 4.8 18.5859V12.4143C4.8 12.0961 4.67357 11.7909 4.44853 11.5658C4.22348 11.3408 3.91826 11.2143 3.6 11.2143H2.5104C3.1776 6.57034 7.1736 2.98594 12 2.98594C16.8264 2.98594 20.8224 6.57034 21.4896 11.2143H20.4C20.0817 11.2143 19.7765 11.3408 19.5515 11.5658C19.3264 11.7909 19.2 12.0961 19.2 12.4143V19.7859C19.2 21.1095 18.1236 22.1859 16.8 22.1859H14.4V20.9859H9.6V24.5859H16.8C19.4472 24.5859 21.6 22.4331 21.6 19.7859C22.9236 19.7859 24 18.7863 24 17.5575V12.5859C24 5.96914 18.6168 0.585938 12 0.585938Z"
                fill="#D2FF00"
              />
            </svg>
            <span
              className={
                'font-museo text-[1.25vw] font-medium text-left-accent'
              }
            >
              FAQ & Support
            </span>
          </Link>
          <Link
            href={'https://zknoid.io'}
            className={
              'flex cursor-pointer flex-row items-center justify-center gap-[0.781vw] hover:opacity-80'
            }
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={'mb-[0.416vw] mt-[0.208vw] h-[1.25vw] w-[1.25vw]'}
            >
              <path
                d="M17.232 14.9859C17.328 14.1939 17.4 13.4019 17.4 12.5859C17.4 11.7699 17.328 10.9779 17.232 10.1859H21.288C21.48 10.9539 21.6 11.7579 21.6 12.5859C21.6 13.4139 21.48 14.2179 21.288 14.9859M15.108 21.6579C15.828 20.3259 16.38 18.8859 16.764 17.3859H20.304C19.1414 19.3879 17.2969 20.9043 15.108 21.6579ZM14.808 14.9859H9.192C9.072 14.1939 9 13.4019 9 12.5859C9 11.7699 9.072 10.9659 9.192 10.1859H14.808C14.916 10.9659 15 11.7699 15 12.5859C15 13.4019 14.916 14.1939 14.808 14.9859ZM12 22.1379C11.004 20.6979 10.2 19.1019 9.708 17.3859H14.292C13.8 19.1019 12.996 20.6979 12 22.1379ZM7.2 7.78594H3.696C4.84663 5.7786 6.68975 4.25972 8.88 3.51394C8.16 4.84594 7.62 6.28594 7.2 7.78594ZM3.696 17.3859H7.2C7.62 18.8859 8.16 20.3259 8.88 21.6579C6.69435 20.9039 4.85382 19.3872 3.696 17.3859ZM2.712 14.9859C2.52 14.2179 2.4 13.4139 2.4 12.5859C2.4 11.7579 2.52 10.9539 2.712 10.1859H6.768C6.672 10.9779 6.6 11.7699 6.6 12.5859C6.6 13.4019 6.672 14.1939 6.768 14.9859M12 3.02194C12.996 4.46194 13.8 6.06994 14.292 7.78594H9.708C10.2 6.06994 11.004 4.46194 12 3.02194ZM20.304 7.78594H16.764C16.3884 6.29969 15.8323 4.86501 15.108 3.51394C17.316 4.26994 19.152 5.79394 20.304 7.78594ZM12 0.585938C5.364 0.585938 0 5.98594 0 12.5859C0 15.7685 1.26428 18.8208 3.51472 21.0712C4.62902 22.1855 5.95189 23.0694 7.4078 23.6725C8.86371 24.2756 10.4241 24.5859 12 24.5859C15.1826 24.5859 18.2348 23.3217 20.4853 21.0712C22.7357 18.8208 24 15.7685 24 12.5859C24 11.0101 23.6896 9.44964 23.0866 7.99374C22.4835 6.53783 21.5996 5.21496 20.4853 4.10066C19.371 2.98635 18.0481 2.10244 16.5922 1.49938C15.1363 0.896327 13.5759 0.585938 12 0.585938Z"
                fill="#D2FF00"
              />
            </svg>
            <span
              className={
                'font-museo text-[1.25vw] font-medium text-left-accent'
              }
            >
              About us
            </span>
          </Link>
        </div>
        <div
          className={'flex flex-row items-center justify-center gap-[0.833vw]'}
        >
          {SOCIALS.map((x) => (
            <Link
              href={x.link}
              key={x.id}
              className={'cursor-pointer hover:opacity-80'}
            >
              <Image
                alt={x.name}
                src={x.image}
                className={'h-[1.25vw] w-[1.25vw]'}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
