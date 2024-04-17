import { clsx } from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

export const Button = ({
  label,
  onClick,
  isFilled = true,
  isBordered = true,
  asLink,
  href = '#',
  className,
  isReadonly = false,
  startContent,
  endContent,
}: {
  label: string;
  onClick?: () => void;
  isFilled?: boolean;
  isBordered?: boolean;
  asLink?: boolean;
  href?: string;
  className?: string;
  isReadonly?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
}) => {
  if (asLink)
    return (
      <div
        className={clsx(
          'mx-auto flex w-full flex-row items-center justify-center gap-2 rounded-[5px] py-2 text-center text-[20px]/[20px] font-medium',
          {
            'bg-left-accent text-dark-buttons-text': isFilled,
            'hover:bg-bg-dark hover:text-left-accent': isFilled && !isReadonly,
            'text-left-accent': !isFilled,
            'hover:opacity-80': !isFilled && !isReadonly,
            'border border-left-accent': isBordered,
            'cursor-default': isReadonly,
          },
          className
        )}
      >
        {(startContent || endContent) && (
          <div className={'flex flex-row items-center justify-end'}>
            {startContent}
          </div>
        )}
        <Link
          href={!isReadonly ? href : '#'}
          onClick={!isReadonly ? onClick : undefined}
          className={'w-full min-w-[40%]'}
        >
          {label}
        </Link>
        {(startContent || endContent) && (
          <div className={'flex flex-row items-center justify-end'}>
            {endContent}
          </div>
        )}
      </div>
    );
  else
    return (
      <div
        className={clsx(
          'mx-auto flex w-full flex-row items-center justify-center gap-2 rounded-[5px] py-2 text-center text-[20px]/[20px] font-medium',
          {
            'bg-left-accent text-dark-buttons-text': isFilled,
            'hover:bg-bg-dark hover:text-left-accent': isFilled && !isReadonly,
            'text-left-accent': !isFilled,
            'hover:opacity-80': !isFilled && !isReadonly,
            'border border-left-accent': isBordered,
            'cursor-default': isReadonly,
            'cursor-pointer': !isReadonly,
          },
          className
        )}
      >
        {(startContent || endContent) && (
          <div className={'flex flex-row items-center justify-end'}>
            {startContent}
          </div>
        )}
        <button
          className={'min-w-[40%]'}
          onClick={!isReadonly ? onClick : undefined}
        >
          {label}
        </button>
        {(startContent || endContent) && (
          <div className={'flex flex-row items-center justify-end'}>
            {endContent}
          </div>
        )}
      </div>
    );
};
