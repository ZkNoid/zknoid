import { clsx } from 'clsx';

export const Checkbox = ({
  isSelected,
  setIsSelected,
  isInvalid,
}: {
  isSelected: boolean;
  setIsSelected: (selected: boolean) => void;
  isInvalid?: boolean;
}) => {
  return (
    <div
      className={clsx(
        'cursor-pointer rounded-[5px] border bg-bg-dark p-1 hover:opacity-80',
        {
          'border-left-accent bg-left-accent': isSelected,
          'hover:border-[#FF00009C]': isInvalid && !isSelected,
          'border-[#FF0000]': isInvalid,
        }
      )}
      onClick={() => setIsSelected(!isSelected)}
    >
      <svg
        aria-hidden="true"
        role="presentation"
        viewBox="0 0 17 18"
        className={'h-3.5 w-3.5'}
      >
        <polyline
          fill="none"
          points="1 9 7 14 15 4"
          stroke="#252525"
          strokeDasharray="22"
          strokeDashoffset="44"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className={isSelected ? 'opacity-100' : 'opacity-0'}
        ></polyline>
      </svg>
    </div>
  );
};
