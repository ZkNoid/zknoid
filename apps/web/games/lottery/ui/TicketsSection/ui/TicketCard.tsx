import { cn } from '@/lib/helpers';
import { TicketBlockButton } from '@/games/lottery/ui/buttons/TicketBlockButton';
import { AnimatePresence, motion } from 'framer-motion';

const TicketsNumPicker = ({
  amount,
  setAmount,
}: {
  amount: number;
  setAmount: (amount: number) => void;
}) => {
  return (
    <div
      className={cn(
        'flex h-[1.67vw] items-center justify-between rounded-[0.33vw]',
        'border border-bg-dark border-opacity-50 text-[1.07vw] text-[#252525]'
      )}
    >
      <div className="p-[0.3vw]" onClick={() => setAmount(amount - 1)}>
        <svg
          width="16"
          height="3"
          viewBox="0 0 16 3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[1.07vw]"
        >
          <path d="M0 0.5H16V2.5H0V0.5Z" fill="#000000" />
          <path d="M0 0.5H16V2.5H0V0.5Z" fill="#000000" />
        </svg>
      </div>
      <div className="mx-[0.4vw] opacity-50">{amount}</div>
      <div className="p-[0.3vw]" onClick={() => setAmount(amount + 1)}>
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
            fill="#000000"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 9.5V16.5H9V9.5H16V7.5H9V0.5H7V7.5H0V9.5H7Z"
            fill="#000000"
          />
        </svg>
      </div>
    </div>
  );
};

export default function TicketCard({
  symbols,
  setSymbols,
  setTicketsAmount,
  amount,
  finalized,
}: {
  symbols: string;
  setSymbols: (symbols: string) => void;
  setTicketsAmount: (amount: number) => void;
  amount: number;
  finalized: boolean;
}) {
  return (
    <div className="relative h-[13.53vw] w-[24vw] rounded-[1.33vw] bg-right-accent p-[0.33vw]">
      <div className="pointer-events-none absolute h-[12.87vw] w-[23.33vw] rounded-[1vw] border border-black"></div>
      <div className="flex w-full flex-col p-[1.33vw]">
        <div className="flex flex-row">
          <div className="text-[1.6vw] uppercase text-black">Ticket 1</div>
          <div className="ml-auto flex gap-[0.33vw] text-[1.07vw] text-right-accent">
            {amount == 0 ? (
              <TicketBlockButton onClick={() => setTicketsAmount(1)}>
                Get ticket
              </TicketBlockButton>
            ) : (
              <TicketsNumPicker amount={amount} setAmount={setTicketsAmount} />
            )}
            {!finalized &&
              (amount == 0 ? (
                <TicketBlockButton onClick={() => setTicketsAmount(1)}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 7V0H7V7H0V9H7V16H9V9H16V7H9Z"
                      fill="#DCB8FF"
                    />
                  </svg>
                </TicketBlockButton>
              ) : (
                <TicketBlockButton onClick={() => setTicketsAmount(0)}>
                  <svg
                    width="16"
                    height="2"
                    viewBox="0 0 16 2"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0H16V2H0V0Z" fill="#DCB8FF" />
                  </svg>
                </TicketBlockButton>
              ))}
          </div>
        </div>
        <div className="flex flex-row gap-[0.33vw]">
          {[0, 1, 2, 3, 4, 5].map((fieldId) => (
            <div
              key={fieldId}
              className={cn(
                'h-[2.67vw] w-[2.67vw] rounded-[0.33vw] border-[0.07vw] border-bg-dark shadow-[inset_5px_5px_5px_#C89EF1,inset_-5px_-5px_5px_rgba(200,158,241,0.5)]',
                'flex items-center justify-center font-museo text-[2.13vw] font-bold text-black'
              )}
            >
              {symbols?.[fieldId] || '_'}
            </div>
          ))}
        </div>
        <div className="mt-[1.6vw] flex flex-row gap-[0.33vw]">
          <AnimatePresence mode={'wait'}>
            {amount > 0 &&
              [1, 2, 3, 4, 5, 6, 7, 8, 9, '←'].map((fieldId, index) => (
                <motion.div
                  key={fieldId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  exit={{ opacity: 0, transition: { delay: index * 0.15 } }}
                  className={cn(
                    'h-[1.87vw] w-[1.87vw] rounded-[0.33vw]',
                    'flex justify-center border border-dashed border-bg-dark text-[2.13vw] text-black',
                    'items-center justify-center text-[1.07vw] text-bg-dark',
                    'cursor-pointer'
                  )}
                  onClick={() => {
                    setSymbols(
                      fieldId == '←'
                        ? symbols.slice(0, -1)
                        : `${symbols}${fieldId}`
                    );
                  }}
                >
                  {fieldId}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
