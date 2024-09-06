export default function LogsMessage({
  time,
  player,
  message,
}: {
  time: string;
  player?: string;
  message: string;
}) {
  return (
    <div className={'flex flex-row gap-2 font-plexsans text-[16px]/[16px]'}>
      <span className={'font-regular text-foreground'}>{time}</span>
      <span className={'font-regular text-foreground'}>[System]:</span>
      {player && (
        <>
          <span className={'text-foreground'}>Player</span>
          <span className={'font-medium text-left-accent'}>{player}</span>
        </>
      )}
      <span className={'font-light text-foreground'}>{message}</span>
    </div>
  );
}
