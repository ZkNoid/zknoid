import MyTicket from './ui/MyTicket';

export default function OwnedTickets() {
  return (
    <div className={'flex w-full flex-col gap-[6vw]'}>
      <MyTicket combination={[1, 2, 3, 4, 5, 6]} amount={2} index={1} />
    </div>
  );
}
