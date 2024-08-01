import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';
import { useEffect, useState } from 'react';
import OwnedTickets from './OwnedTickets';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { AnimatePresence } from 'framer-motion';
import PreviousRounds from '@/games/lottery/ui/TicketsSection/PreviousRounds';
import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';
import { useRoundsStore } from '@/games/lottery/lib/roundsStore';
// import GetMoreTicketsButton from './ui/GetMoreTicketsButton';

interface TicketInfo {
  amount: number;
  numbers: number[];
}

export default function TicketsSection() {
  const workerClientStore = useWorkerClientStore();
  const lotteryStore = useWorkerClientStore();
  const roundsStore = useRoundsStore();
  const notificationStore = useNotificationStore();

  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [blankTicket, setBlankTicket] = useState<boolean>(true);

  useEffect(() => {
    setTickets([]);
  }, [roundsStore.roundToShowId]);

  useEffect(() => {
    if (tickets.length == 0 && !blankTicket) setBlankTicket(true);
  }, [tickets.length]);

  const renderTickets = blankTicket ? [...tickets, blankTicket] : tickets;

  return (
    <div
      className={cn(
        'relative rounded-[0.67vw] border border-left-accent bg-bg-grey',
        'flex flex-col gap-[2.604vw] px-[2vw] py-[2.67vw]'
      )}
    >
      <div className="">
        <div
          className={cn('grid gap-[2vw]', {
            'grid-cols-2':
              roundsStore.roundToShowId == lotteryStore.lotteryRoundId,
            'grid-cols-1':
              roundsStore.roundToShowId != lotteryStore.lotteryRoundId,
          })}
        >
          <OwnedTickets />
          {roundsStore.roundToShowId == lotteryStore.lotteryRoundId && (
            <div className={'flex flex-col'}>
              <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
              <div className={'flex flex-row gap-[1.33vw]'}>
                <div className={'flex flex-col gap-0'}>
                  <AnimatePresence>
                    {renderTickets.map((_, index) => (
                      <TicketCard
                        key={index}
                        index={index}
                        ticketsAmount={tickets.length}
                        addTicket={(ticket) => {
                          if (tickets.length == index) {
                            setTickets([...tickets, ticket]);
                          } else {
                            tickets[index] = ticket;
                          }
                          setBlankTicket(false);
                          notificationStore.create({
                            type: 'success',
                            message: `Ticket ${ticket.numbers.toString().replaceAll(',', '')} submitted`,
                            isDismissible: true,
                            dismissAfterDelay: true,
                          });
                        }}
                        removeTicketByIdx={(index: number) => {
                          if (tickets.length != 0) {
                            if (index == tickets.length) {
                              setBlankTicket(false);
                            } else {
                              tickets.splice(index, 1);
                            }

                            notificationStore.create({
                              type: 'success',
                              message: 'Ticket removed',
                              isDismissible: true,
                              dismissAfterDelay: true,
                            });
                          }
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                <div
                  className={'flex flex-col gap-[1.33vw]'}
                  id={'ticketsToBuy'}
                >
                  <BuyInfoCard
                    buttonActive={
                      workerClientStore.lotteryCompiled &&
                      !workerClientStore.isActiveTx &&
                      tickets.length > 0 &&
                      tickets[0].amount != 0
                    }
                    ticketsInfo={tickets}
                    loaderActive={
                      workerClientStore.lotteryCompiled &&
                      workerClientStore.isActiveTx
                    }
                    onFinally={() => {
                      setTickets([]);
                    }}
                  />
                  {/*<GetMoreTicketsButton*/}
                  {/*  disabled={blankTicket}*/}
                  {/*  onClick={() => {*/}
                  {/*    setBlankTicket(true);*/}
                  {/*  }}*/}
                  {/*/>*/}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <PreviousRounds />
    </div>
  );
}
