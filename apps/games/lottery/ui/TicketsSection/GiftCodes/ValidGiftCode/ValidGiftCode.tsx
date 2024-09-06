export default function ValidGiftCode({ giftCode }: { giftCode: string }) {
  return (
    <div
      className={
        'flex w-[22.5vw] flex-col gap-[0.521vw] rounded-b-[0.521vw] bg-[#252525] p-[0.521vw]'
      }
    >
      <span className={'font-plexsans text-[0.729vw] text-foreground'}>
        Code <b className={'font-extrabold'}>{giftCode}</b> is valid. Please
        fill the ticket numbers and receive the ticket
      </span>
    </div>
  );
}
