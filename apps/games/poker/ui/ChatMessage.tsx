export default function ChatMessage({
  time,
  sender,
  message,
}: {
  time: string;
  sender: string;
  message: string;
}) {
  return (
    <div className={'flex flex-row gap-2 font-plexsans text-[16px]/[16px]'}>
      <span className={'font-regular text-foreground'}>{time}</span>
      <span className={'font-medium text-left-accent'}>{sender}:</span>
      <span className={'font-light text-foreground'}>{message}</span>
    </div>
  );
}
