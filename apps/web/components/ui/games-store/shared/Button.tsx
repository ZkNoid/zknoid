import { clsx } from 'clsx';
import Link from 'next/link';

export const Button = ({
  label,
  onClick,
  isFilled = true,
  isBordered = true,
  asLink,
  href = '#',
}: {
  label: string;
  onClick?: () => void;
  isFilled?: boolean;
  isBordered?: boolean;
  asLink?: boolean;
  href?: string;
}) => {
  if (asLink)
    return (
      <Link
        href={href}
        className={clsx(
          'w-full rounded-[5px] py-2 text-center text-[20px]/[20px] font-medium',
          {
            'bg-left-accent text-dark-buttons-text hover:bg-bg-dark hover:text-left-accent':
              isFilled,
            'text-left-accent hover:opacity-80': !isFilled,
            'border border-left-accent': isBordered,
          }
        )}
        onClick={onClick}
      >
        {label}
      </Link>
    );
  else
    return (
      <button
        className={clsx(
          'w-full rounded-[5px] py-2 text-center text-[20px]/[20px] font-medium',
          {
            'bg-left-accent text-dark-buttons-text hover:bg-bg-dark hover:text-left-accent':
              isFilled,
            'text-left-accent hover:opacity-80': !isFilled,
            'border border-left-accent': isBordered,
          }
        )}
        onClick={onClick}
      >
        {label}
      </button>
    );
};
