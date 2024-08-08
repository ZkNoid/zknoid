import { cn } from '@/lib/helpers';

export default function BuyGiftCodesCounter({
  giftCodeToBuyAmount,
  setGiftCodeToBuyAmount,
}: {
  giftCodeToBuyAmount: number;
  setGiftCodeToBuyAmount: (amount: number) => void;
}) {
  return (
    <div
      className={
        'flex flex-col rounded-b-[0.521vw] bg-[#252525] px-[0.521vw] pb-[0.521vw] pt-[1.25vw]'
      }
    >
      <div
        className={
          'flex w-[90%] flex-row items-center justify-between border-b border-foreground pb-[0.729vw]'
        }
      >
        <span
          className={'font-plexsans text-[0.833vw] font-medium text-foreground'}
        >
          Add codes to cart
        </span>
        <div
          className={cn(
            'flex h-[1.6vw] items-center justify-between rounded-[0.33vw]',
            'text-[1.07vw] text-[#252525]'
          )}
        >
          <button
            className="cursor-pointer p-[0.3vw] hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => setGiftCodeToBuyAmount(giftCodeToBuyAmount - 1)}
            disabled={giftCodeToBuyAmount - 1 < 1}
          >
            <svg
              width="16"
              height="3"
              viewBox="0 0 16 3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[1.07vw]"
            >
              <path d="M0 0.5H16V2.5H0V0.5Z" fill="#F9F8F4" />
              <path d="M0 0.5H16V2.5H0V0.5Z" fill="#F9F8F4" />
            </svg>
          </button>
          <div className="mx-[0.4vw] text-foreground opacity-50">
            {giftCodeToBuyAmount}
          </div>
          <div
            className="cursor-pointer p-[0.3vw] hover:opacity-60"
            onClick={() => setGiftCodeToBuyAmount(giftCodeToBuyAmount + 1)}
          >
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[1.07vw]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 9.5V16.5H9V9.5H16V7.5H9V0.5H7V7.5H0V9.5H7Z"
                fill="#F9F8F4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 9.5V16.5H9V9.5H16V7.5H9V0.5H7V7.5H0V9.5H7Z"
                fill="#F9F8F4"
              />
            </svg>
          </div>
        </div>
      </div>
      <span
        className={
          'w-[90%] pt-[0.521vw] font-plexsans text-[0.729vw] text-foreground'
        }
      >
        After paying for the gift codes, you can copy them in this window and
        give them to your friends
      </span>
    </div>
  );
}
