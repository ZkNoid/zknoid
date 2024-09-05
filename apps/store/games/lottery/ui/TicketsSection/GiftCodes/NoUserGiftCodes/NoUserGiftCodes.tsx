import Image from 'next/image';
import noCodesImg from '@/public/image/misc/no-gift-codes.svg';

export default function NoUserGiftCodes({
  setVoucherMode,
}: {
  setVoucherMode: () => void;
}) {
  return (
    <div
      className={
        'flex h-full flex-col items-center justify-between p-[0.521vw]'
      }
    >
      <span className={'font-plexsans text-[0.729vw] text-foreground'}>
        You haven&apos;t purchased the codes yet and you don&apos;t have any
        available. Go to “NEW CODES” or click button to purchase one.
      </span>
      <Image
        src={noCodesImg}
        alt={'No codes image'}
        className={'my-[0.99vw] w-1/2'}
      />
      <button
        className={
          'w-full rounded-[0.26vw] bg-right-accent py-[0.26vw] text-center font-museo text-[0.729vw] font-medium text-bg-dark'
        }
        onClick={setVoucherMode}
      >
        Buy access gift codes
      </button>
    </div>
  );
}
