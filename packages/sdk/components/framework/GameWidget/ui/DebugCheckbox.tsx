import { clsx } from 'clsx';

export const DebugCheckbox = ({
  debug,
  setDebug,
}: {
  debug: boolean;
  setDebug: (debug: boolean) => void;
}) => {
  return (
    <div className={'hidden w-full items-center justify-end lg:flex'}>
      <div
        onClick={() => setDebug(!debug)}
        className={
          'flex cursor-pointer flex-row items-center gap-4 hover:opacity-80'
        }
      >
        <span className={'text-buttons-menu'}>Debug</span>
        <div
          className={clsx(
            'cursor-pointer rounded-[5px] border bg-bg-dark p-1',
            {
              'border-left-accent bg-left-accent': debug,
            }
          )}
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
    </div>
  );
};
