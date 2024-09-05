export default function PlayerListItem({
  id,
  address,
  nickname,
}: {
  id: number;
  address: string;
  nickname: string;
}) {
  return (
    <div
      className={
        'mb-4 flex w-full flex-row justify-between border-t border-foreground pt-4 text-[16px]/[16px] last:border-b last:pb-4'
      }
    >
      <span className={'w-[10%]'}>[{id}]</span>
      <span className={'w-[60%]'}>{address}</span>
      <span className={'w-[30%]'}>{nickname}</span>
    </div>
  );
}
