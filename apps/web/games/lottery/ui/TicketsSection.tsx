import { TicketBlockButton } from './buttons/TicketBlockButton';
import { cn } from '@/lib/helpers';

export default function TicketsSection({}: {}) {
  return (
    <div
      className={cn(
        'relative h-[28.8vw] items-center justify-center rounded-[0.67vw] border border-left-accent',
        'px-[2vw] py-[2.67vw]'
      )}
    >
      <div className="">
        <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
        <div className="relative h-[13.53vw] w-[24vw] rounded-[1.33vw] bg-right-accent p-[0.33vw]">
          <div className="absolute -z-10 h-[12.87vw] w-[23.33vw] rounded-[1vw] border border-black"></div>
          <div className="flex w-full flex-col p-[1.33vw]">
            <div className="flex flex-row">
              <div className="text-[1.6vw] uppercase text-black">Ticket 1</div>
              <div className="ml-auto flex gap-[0.33vw] text-[1.07vw] text-right-accent">
                <TicketBlockButton>Get ticket</TicketBlockButton>
                <TicketBlockButton>
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
              </div>
            </div>
            <div className="flex flex-row gap-[0.33vw]">
              {[0, 1, 2, 3, 4, 5].map((fieldId) => (
                <div
                  key={fieldId}
                  className={cn(
                    'h-[2.67vw] w-[2.67vw] rounded-[0.33vw] border-[0.07vw] border-bg-dark shadow-[inset_5px_5px_5px_#C89EF1,inset_-5px_-5px_5px_rgba(200,158,241,0.5)]',
                    'flex justify-center text-[2.13vw] text-black'
                  )}
                >
                  _
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
