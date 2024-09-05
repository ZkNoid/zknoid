export const FullscreenButton = ({
  isFullscreen,
  setIsFullscreen,
}: {
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
}) => {
  return (
    <div
      className={
        'group absolute bottom-2 right-2 hidden cursor-pointer rounded-[5px] bg-[#252525] p-2 lg:block'
      }
      onClick={() => setIsFullscreen(!isFullscreen)}
    >
      {isFullscreen ? (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={'group-hover:opacity-80'}
        >
          <rect
            x="9"
            y="9"
            width="2"
            height="9"
            transform="rotate(-180 9 9)"
            fill="#D2FF00"
          />
          <rect
            width="2"
            height="9"
            transform="matrix(-1 8.74228e-08 8.74228e-08 1 9 17)"
            fill="#D2FF00"
          />
          <rect
            width="2"
            height="9"
            transform="matrix(1 -8.74228e-08 -8.74228e-08 -1 17 9)"
            fill="#D2FF00"
          />
          <rect x="17" y="17" width="2" height="9" fill="#D2FF00" />
          <rect
            y="9"
            width="2"
            height="9"
            transform="rotate(-90 0 9)"
            fill="#D2FF00"
          />
          <rect
            width="2"
            height="9"
            transform="matrix(1.31134e-07 1 1 -1.31134e-07 0 17)"
            fill="#D2FF00"
          />
          <rect
            width="2"
            height="9"
            transform="matrix(-1.31134e-07 -1 -1 1.31134e-07 26 9)"
            fill="#D2FF00"
          />
          <rect
            x="26"
            y="17"
            width="2"
            height="9"
            transform="rotate(90 26 17)"
            fill="#D2FF00"
          />
        </svg>
      ) : (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={'group-hover:opacity-80'}
        >
          <rect width="2" height="9" fill="#D2FF00" />
          <rect
            width="2"
            height="9"
            transform="matrix(1 -1.74846e-07 -1.74846e-07 -1 0 26)"
            fill="#D2FF00"
          />
          <rect
            width="2"
            height="9"
            transform="matrix(-1 0 0 1 26 0)"
            fill="#D2FF00"
          />
          <rect
            x="26"
            y="26"
            width="2"
            height="9"
            transform="rotate(-180 26 26)"
            fill="#D2FF00"
          />
          <rect
            x="9"
            width="2"
            height="9"
            transform="rotate(90 9 0)"
            fill="#D2FF00"
          />
          <rect
            width="2"
            height="9"
            transform="matrix(-2.18557e-07 -1 -1 2.18557e-07 9 26)"
            fill="#D2FF00"
          />
          <rect
            width="2"
            height="9"
            transform="matrix(4.37114e-08 1 1 -4.37114e-08 17 0)"
            fill="#D2FF00"
          />
          <rect
            x="17"
            y="26"
            width="2"
            height="9"
            transform="rotate(-90 17 26)"
            fill="#D2FF00"
          />
        </svg>
      )}
    </div>
  );
};
