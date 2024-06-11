import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function Button({
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
  color = 'primary',
  type = 'button',
  disabled,
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
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'foreground'
    | 'dark'
    | 'semidark';
  type?: 'reset' | 'submit' | 'button';
  disabled?: boolean;
}) {
  if (asLink)
    return (
      <motion.div
        className={clsx(
          'flex w-full flex-row items-center justify-center gap-2 rounded-[5px] py-2 text-center text-[16px]/[16px] font-medium lg:text-[20px]/[20px]',
          {
            'hover:opacity-80': !isFilled && !isReadonly,
            'cursor-default': isReadonly,
            'cursor-pointer': !isReadonly,

            'bg-left-accent text-dark-buttons-text':
              color == 'primary' && isFilled,
            'hover:bg-bg-dark hover:text-left-accent':
              color == 'primary' && isFilled && !isReadonly,
            'text-left-accent': color == 'primary' && !isFilled,
            'border border-left-accent': color == 'primary' && isBordered,

            'bg-middle-accent text-dark-buttons-text':
              color == 'secondary' && isFilled,
            'hover:bg-bg-dark hover:text-middle-accent':
              color == 'secondary' && isFilled && !isReadonly,
            'text-middle-accent': color == 'secondary' && !isFilled,
            'border border-middle-accent': color == 'secondary' && isBordered,

            'bg-right-accent text-dark-buttons-text':
              color == 'tertiary' && isFilled,
            'hover:bg-bg-dark hover:text-right-accent':
              color == 'tertiary' && isFilled && !isReadonly,
            'text-right-accent': color == 'tertiary' && !isFilled,
            'border border-right-accent': color == 'tertiary' && isBordered,

            'bg-foreground text-dark-buttons-text':
              color == 'foreground' && isFilled,
            'hover:bg-bg-dark hover:text-foreground':
              (color == 'foreground' ||
                color == 'dark' ||
                color == 'semidark') &&
              isFilled &&
              !isReadonly,
            'text-foreground-accent':
              (color == 'foreground' ||
                color == 'dark' ||
                color == 'semidark') &&
              !isFilled,
            'border border-foreground':
              (color == 'foreground' ||
                color == 'dark' ||
                color == 'semidark') &&
              isBordered,

            'bg-bg-dark text-foreground': color == 'dark' && isFilled,

            'bg-[#252525] text-foreground': color == 'semidark' && isFilled,
          },
          className
        )}
        onClick={!isReadonly ? onClick : undefined}
        whileTap={{ scale: 0.9 }}
      >
        {(startContent || endContent) && (
          <div className={'flex flex-row items-center justify-end'}>
            {startContent}
          </div>
        )}
        <Link href={!isReadonly ? href : '#'} className={'w-full min-w-[40%]'}>
          {label}
        </Link>
        {(startContent || endContent) && (
          <div className={'flex flex-row items-center justify-end'}>
            {endContent}
          </div>
        )}
      </motion.div>
    );
  else
    return (
      <motion.button
        disabled={disabled}
        type={type}
        className={clsx(
          'flex w-full flex-row items-center justify-center gap-2 rounded-[5px] py-2 text-center text-[16px]/[16px] font-medium lg:text-[20px]/[20px]',
          {
            'opacity-50': disabled,
            'hover:opacity-80': !isFilled && !isReadonly && !disabled,
            'cursor-default': isReadonly || disabled,
            'cursor-pointer': !isReadonly && !disabled,

            'bg-left-accent text-dark-buttons-text':
              color == 'primary' && isFilled,
            'hover:bg-bg-dark hover:text-left-accent':
              color == 'primary' && isFilled && !isReadonly && !disabled,
            'text-left-accent': color == 'primary' && !isFilled,
            'border border-left-accent': color == 'primary' && isBordered,

            'bg-middle-accent text-dark-buttons-text':
              color == 'secondary' && isFilled,
            'hover:bg-bg-dark hover:text-middle-accent':
              color == 'secondary' && isFilled && !isReadonly && !disabled,
            'text-middle-accent': color == 'secondary' && !isFilled,
            'border border-middle-accent': color == 'secondary' && isBordered,

            'bg-right-accent text-dark-buttons-text':
              color == 'tertiary' && isFilled,
            'hover:bg-bg-dark hover:text-right-accent':
              color == 'tertiary' && isFilled && !isReadonly && !disabled,
            'text-right-accent': color == 'tertiary' && !isFilled,
            'border border-right-accent': color == 'tertiary' && isBordered,

            'bg-foreground text-dark-buttons-text':
              color == 'foreground' && isFilled,
            'hover:bg-bg-dark hover:text-foreground':
              (color == 'foreground' ||
                color == 'dark' ||
                color == 'semidark') &&
              isFilled &&
              !isReadonly &&
              !disabled,
            'text-foreground-accent':
              (color == 'foreground' ||
                color == 'dark' ||
                color == 'semidark') &&
              !isFilled,
            'border border-foreground':
              (color == 'foreground' ||
                color == 'dark' ||
                color == 'semidark') &&
              isBordered,

            'bg-bg-dark text-foreground': color == 'dark' && isFilled,

            'bg-[#252525] text-foreground': color == 'semidark' && isFilled,
          },
          className
        )}
        onClick={!isReadonly && !disabled ? onClick : undefined}
        whileTap={disabled ? undefined : { scale: 0.9 }}
      >
        {(startContent || endContent) && (
          <div className={'flex flex-row items-center justify-end'}>
            {startContent}
          </div>
        )}
        <div className={'min-w-[40%]'}>{label}</div>
        {(startContent || endContent) && (
          <div className={'flex flex-row items-center justify-end'}>
            {endContent}
          </div>
        )}
      </motion.button>
    );
}
