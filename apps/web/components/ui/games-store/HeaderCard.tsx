import Image from 'next/image';

export const HeaderCard = ({
  image,
  text,
  toggle,
  onClick,
  isMiddle,
}: {
  image: string;
  text: string;
  toggle?: boolean;
  onClick?: () => void;
  isMiddle?: boolean;
}) => (
  <div
    className={`flex cursor-pointer items-center gap-[10px] rounded bg-left-accent p-1 px-2 text-[16px] text-bg-dark ${
      isMiddle && 'bg-middle-accent'
    }`}
    onClick={() => onClick?.()}
  >
    <Image src={image} alt="" width={24} height={24} />
    {text}
    {toggle && (
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 1.5L8 8.5L1 1.5"
          stroke="#252525"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </div>
);
