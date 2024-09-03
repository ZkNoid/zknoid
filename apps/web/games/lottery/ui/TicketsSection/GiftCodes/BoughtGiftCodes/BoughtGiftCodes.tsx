import BoughtGiftCodeItem from './ui/BoughtGiftCodeItem';
import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';

export default function BoughtGiftCodes({
  giftCodes,
}: {
  giftCodes: string[];
}) {
  const notificationStore = useNotificationStore();
  const copyCodes = (giftCode: string | string[]) => {
    const codes = giftCode.toString().replaceAll(',', ', ');
    navigator.clipboard.writeText(codes);
    notificationStore.create({
      type: 'success',
      message: 'Copied!',
    });
  };
  return (
    <div
      className={
        'flex h-full flex-col rounded-b-[0.521vw] bg-[#252525] px-[0.521vw] pb-[0.521vw] pt-[1.25vw]'
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
          Codes preparation
        </span>
      </div>
      <span
        className={
          'w-[90%] pt-[0.521vw] font-plexsans text-[0.729vw] text-foreground'
        }
      >
        After paying for the gift codes, you can copy them in this window and
        give them to your friends
      </span>
      <div
        className={
          'mb-[0.521vw] mt-[0.781vw] flex w-full flex-row gap-[0.521vw]'
        }
      >
        <div
          className={
            'grid max-h-[6.771vw] w-full grid-cols-2 gap-x-[1.094vw] gap-y-[0.521vw] overflow-y-scroll pr-[0.5vw]'
          }
        >
          {giftCodes.map((item, index) => (
            <BoughtGiftCodeItem key={index} code={item} />
          ))}
        </div>
        {/*<div></div>*/}
      </div>
      <button
        className={
          'mt-auto w-full cursor-pointer rounded-[0.26vw] bg-right-accent py-[0.26vw] text-center font-museo text-[0.729vw] font-medium text-bg-dark hover:opacity-80'
        }
        onClick={() => copyCodes(giftCodes)}
      >
        Copy all
      </button>
    </div>
  );
}
