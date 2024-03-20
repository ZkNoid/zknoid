import { clsx } from 'clsx';

export const DebugCheckbox = ({
  debug,
  setDebug,
}: {
  debug: boolean;
  setDebug: (debug: boolean) => void;
}) => {
  return (
    <div className={'flex w-full items-center justify-end gap-4'}>
      <span className={'text-buttons-menu'}>Debug</span>
      <div
        className={clsx(
          'cursor-pointer rounded-[5px] border bg-bg-dark p-1 hover:opacity-80',
          {
            'border-left-accent bg-left-accent': debug,
          }
        )}
        onClick={() => setDebug(!debug)}
      >
        <svg
          aria-hidden="true"
          role="presentation"
          viewBox="0 0 17 18"
          className={'h-2 w-2'}
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
            className={debug ? 'opacity-100' : 'opacity-0'}
          ></polyline>
        </svg>
      </div>
    </div>
  );
};
