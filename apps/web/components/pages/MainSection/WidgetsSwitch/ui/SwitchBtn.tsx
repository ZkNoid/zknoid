import { Pages } from '@/components/pages/MainSection/lib/pages';
import { ReactNode } from 'react';
import { cn } from '@/lib/helpers';

export default function SwitchBtn({
  switchPage,
  page,
  setPage,
  startContent,
  className,
}: {
  switchPage: Pages;
  page: Pages;
  setPage: (page: Pages) => void;
  startContent?: (selected: boolean) => ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cn(
        `relative`,
        'rounded-t-[10px] border-x border-t border-left-accent py-2 lg:first:-mr-[2.5rem] lg:first:pr-10',
        'lg:rounded-none lg:border-none',
        className
      )}
      onClick={() => setPage(switchPage)}
    >
      <div
        className={'absolute left-0 top-0 -z-20 hidden h-full w-full lg:block'}
      >
        <svg
          width="307"
          height="191"
          viewBox="0 0 307 191"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full"
        >
          <path
            d="M1 31.5859V111.086V159.086C1 175.654 14.4315 189.086 31 189.086H276C292.569 189.086 306 175.654 306 159.086V63.5123C306 55.5559 302.839 47.9252 297.213 42.2991L265.287 10.3727C259.661 4.74664 252.03 1.58594 244.074 1.58594H31C14.4315 1.58594 1 15.0174 1 31.5859Z"
            fill="#252525"
            stroke="#D2FF00"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div
        className={
          'flex w-full items-center gap-[3.125vw] pl-[3.125vw] lg:h-[3.188vw] lg:gap-[0.838vw] lg:pl-[1.775vw]'
        }
      >
        {startContent?.(page === switchPage)}
        <span
          className={cn(
            'group-hover:opacity-80',
            page === switchPage && 'text-left-accent',
            'text-[6.25vw] lg:text-[1.5vw]',
            'overflow-ellipsis whitespace-nowrap'
          )}
        >
          {switchPage}
        </span>
      </div>
    </button>
  );
}
