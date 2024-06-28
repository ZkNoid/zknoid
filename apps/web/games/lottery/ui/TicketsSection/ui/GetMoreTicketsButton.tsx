export default function GetMoreTicketsButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={
        'flex w-full cursor-pointer flex-row items-center justify-center gap-[1.33vw] rounded-[2vw] bg-[#252525] p-[0.67vw] text-[1.07vw] text-foreground shadow-2xl hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60'
      }
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={'mb-1'}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 7.5V0.5H7V7.5H0V9.5H7V16.5H9V9.5H16V7.5H9Z"
          fill="#F9F8F4"
        />
      </svg>
      <span>Get one more ticket</span>
    </button>
  );
}
