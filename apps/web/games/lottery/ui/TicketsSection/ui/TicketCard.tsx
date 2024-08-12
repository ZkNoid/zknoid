import { cn } from '@/lib/helpers';
import { TicketBlockButton } from '@/games/lottery/ui/buttons/TicketBlockButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { VoucherMode } from '@/games/lottery/ui/TicketsSection/lib/voucherMode';

const TicketsNumPicker = ({
  amount,
  setAmount,
  removeTicket,
}: {
  amount: number;
  setAmount: (amount: number) => void;
  removeTicket: () => void;
}) => {
  return (
    <div
      className={cn(
        'flex h-[1.6vw] items-center justify-between rounded-[0.33vw]',
        'border border-bg-dark border-opacity-50 text-[1.07vw] text-[#252525]'
      )}
    >
      <div
        className="cursor-pointer p-[0.3vw] hover:opacity-60"
        onClick={() => {
          if (amount - 1 >= 1) {
            setAmount(amount - 1);
          } else {
            removeTicket();
          }
        }}
      >
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
      <div
        className="cursor-pointer p-[0.3vw] hover:opacity-60"
        onClick={() => setAmount(amount + 1)}
      >
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

const ClearTicketButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <TicketBlockButton onClick={onClick}>
      <svg
        width="0.885vw"
        height="0.885vw"
        viewBox="0 0 17 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={'h-[0.885vw] w-[0.885vw]'}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.4221 1.50698C6.45025 1.50241 6.49206 1.50005 6.74812 1.50005H9.62687C9.88294 1.50005 9.92475 1.50241 9.9529 1.50698L9.95504 1.50732C10.0417 1.52115 10.124 1.55507 10.1952 1.60638C10.2663 1.65756 10.3244 1.72461 10.365 1.8022C10.3797 1.83066 10.3971 1.87478 10.4764 2.11247L10.558 2.35753C10.586 2.44887 10.6191 2.53816 10.6569 2.62505H5.71809C5.73959 2.57574 5.75955 2.52563 5.77791 2.47481L5.78144 2.46503L5.7847 2.45515L5.81376 2.3671L5.81445 2.36503L5.89864 2.11247C5.9779 1.87468 5.99536 1.83063 6.01005 1.80217C6.05062 1.72459 6.10873 1.65755 6.17976 1.60638C6.251 1.55507 6.33326 1.52115 6.41996 1.50733L6.4221 1.50698ZM3.46034 2.62505H3.375H0.75C0.335786 2.62505 0 2.96084 0 3.37505C0 3.78927 0.335786 4.12505 0.75 4.12505H3.375H3.47125H3.48083H12.887C12.9279 4.12606 12.969 4.12606 13.0101 4.12505H15.625C16.0392 4.12505 16.375 3.78927 16.375 3.37505C16.375 2.96084 16.0392 2.62505 15.625 2.62505H12.9097C12.7137 2.61743 12.5237 2.55229 12.3638 2.43701C12.1854 2.30838 12.0543 2.12451 11.991 1.91388L11.9878 1.90327L11.9843 1.89276L11.8994 1.63813L11.8895 1.60836C11.8281 1.42412 11.7734 1.25983 11.6961 1.11076L11.6955 1.10953C11.5467 0.82407 11.3331 0.577396 11.0719 0.389251C10.811 0.201303 10.5097 0.0769753 10.1922 0.0261914C10.0285 -0.000267327 9.8554 -0.000123858 9.6697 3.01003e-05L9.62687 5.36442e-05H6.74812L6.7053 3.01003e-05C6.51958 -0.000123858 6.34648 -0.000267327 6.18272 0.0262036C5.86522 0.076995 5.56398 0.201317 5.30307 0.389251C5.04186 0.577396 4.82833 0.82407 4.67954 1.10953L4.6789 1.11076C4.60156 1.25982 4.54686 1.42411 4.48553 1.60835L4.48553 1.60835L4.47561 1.63813L4.39073 1.89276L4.39005 1.89483L4.36401 1.97371C4.29503 2.15948 4.17238 2.32065 4.01155 2.43665C3.85053 2.5528 3.65864 2.61835 3.46034 2.62505ZM10.1922 0.0261914L10.1912 0.0260329L10.0731 0.766598L10.1933 0.0263766L10.1922 0.0261914ZM10.558 2.35753L10.5545 2.34598L11.2727 2.12993L10.5612 2.3671L10.558 2.35753ZM10.365 1.8022L10.3647 1.8016L11.0303 1.4562L10.3653 1.80282L10.365 1.8022ZM2.95696 5.51266C2.92941 5.09937 2.57203 4.78666 2.15874 4.81421C1.74544 4.84177 1.43273 5.19915 1.46029 5.61244L1.86277 11.6497L1.86279 11.6499L1.86572 11.6941C1.94001 12.8147 2.00061 13.7287 2.14388 14.4476C2.29324 15.1971 2.54996 15.8361 3.08723 16.3388C3.62478 16.8421 4.27994 17.0559 5.03803 17.1551C5.76352 17.2501 6.67735 17.2501 7.79693 17.2501H7.79694H7.84888H8.52612H8.57806H8.57807C9.69765 17.2501 10.6115 17.2501 11.337 17.1551C12.0949 17.0559 12.7499 16.8422 13.2874 16.3391C13.8251 15.8362 14.0816 15.197 14.2308 14.4475C14.3735 13.7311 14.4342 12.8208 14.5085 11.7055L14.5085 11.7054L14.5122 11.65L14.5122 11.6499L14.9147 5.61244C14.9423 5.19915 14.6296 4.84177 14.2163 4.81421C13.803 4.78666 13.4456 5.09937 13.418 5.51266L13.0155 11.5501C12.9367 12.7317 12.8811 13.5448 12.7597 14.1546C12.6425 14.7432 12.4821 15.0385 12.2628 15.2435L12.2625 15.2439C12.0432 15.4492 11.7376 15.5899 11.1423 15.6678C10.5255 15.7485 9.71033 15.7501 8.52612 15.7501H7.84888C6.66467 15.7501 5.84948 15.7485 5.23275 15.6678C4.63743 15.5899 4.33184 15.4492 4.11251 15.2439L4.11218 15.2435C3.89281 15.0384 3.73223 14.7429 3.61496 14.1545C3.49347 13.5449 3.43782 12.7318 3.35948 11.5504L3.35946 11.5502L2.95696 5.51266ZM6.74628 7.67543C6.70506 7.26327 6.33753 6.96256 5.92537 7.00378C5.51321 7.04499 5.21251 7.41252 5.25372 7.82468L5.69122 12.1997C5.73244 12.6118 6.09997 12.9125 6.51213 12.8713C6.92429 12.8301 7.22499 12.4626 7.18378 12.0504L6.74628 7.67543ZM11.1213 7.82468C11.1625 7.41252 10.8618 7.04499 10.4496 7.00378C10.0375 6.96256 9.66994 7.26327 9.62872 7.67543L9.19122 12.0504C9.15001 12.4626 9.45071 12.8301 9.86287 12.8713C10.275 12.9125 10.6426 12.6118 10.6838 12.1997L11.1213 7.82468Z"
          fill="#DCB8FF"
        />
      </svg>
    </TicketBlockButton>
  );
};

export default function TicketCard({
  index,
  ticketsAmount,
  addTicket,
  removeTicketByIdx,
  voucherMode,
}: {
  index: number;
  ticketsAmount: number;
  addTicket: (ticket: { numbers: number[]; amount: number }) => void;
  removeTicketByIdx: (index: number) => void;
  voucherMode: VoucherMode;
}) {
  const [symbols, setSymbols] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [finalized, setFinalized] = useState<boolean>(false);
  const [finalAmount, setFinalAmount] = useState<number | undefined>(undefined);

  const workerClientStore = useWorkerClientStore();

  const generateRandomNumbers = () => {
    let numbers = '';
    for (let i = 0; i < 6; i++) {
      numbers += Math.ceil(Math.random() * 9);
    }
    setSymbols(numbers);
  };

  const convertSymbolsToNumbers = () => {
    return [...symbols].map((x) => Number(x));
  };

  const submitTicket = () => {
    setFinalAmount(amount);
    setFinalized(true);
    addTicket({ numbers: convertSymbolsToNumbers(), amount: amount });
  };

  const clearStates = () => {
    setSymbols('');
    if (voucherMode !== VoucherMode.UseValid) setAmount(0);
    setFinalized(false);
  };

  useEffect(() => {
    if (voucherMode == VoucherMode.UseValid && amount != 1) setAmount(1);
  }, [voucherMode]);

  useEffect(() => {
    if (ticketsAmount != 0) {
      setAmount(1);
    }
  }, [ticketsAmount]);

  const removeTicket = () => {
    if (voucherMode == VoucherMode.UseValid) {
      clearStates();
    } else {
      if (ticketsAmount == 0) {
        clearStates();
      }
      removeTicketByIdx(index);
    }
  };

  useEffect(() => {
    if (finalized && ticketsAmount == 0) {
      clearStates();
    }
  }, [finalized, ticketsAmount]);

  return (
    <motion.div
      className={cn(
        'relative -mt-[25%] w-[22.5vw] rounded-[1.33vw] bg-right-accent p-[0.33vw] first:mt-0',
        { 'h-[13.53vw]': !finalized, 'h-fit': finalized }
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={
        finalized && index != ticketsAmount - 1 ? { y: '-35%' } : undefined
      }
      transition={{ damping: 0, stiffness: 0 }}
    >
      <div
        className={cn(
          'flex w-full flex-col rounded-[1.042vw] border border-bg-dark p-[0.781vw]',
          { 'h-full': !finalized }
        )}
      >
        <div className="flex flex-row items-center">
          <div className="text-[1.5vw] uppercase text-black">Ticket</div>
          <div className="ml-auto flex gap-[0.33vw] text-[1.07vw] text-right-accent">
            {amount == 0 ? (
              <TicketBlockButton onClick={() => setAmount(1)}>
                Get ticket
              </TicketBlockButton>
            ) : finalized ? (
              <div className={'flex flex-row gap-[0.26vw]'}>
                {!workerClientStore.isActiveTx && (
                  <ClearTicketButton onClick={removeTicket} />
                )}
                <div
                  className={
                    'h-[1.6vw] rounded-[0.33vw] border border-bg-dark px-[0.3vw] pb-[0.3vw] pt-[0.15vw] font-plexsans text-[0.833vw] font-medium text-bg-dark'
                  }
                >
                  {finalAmount
                    ? `${finalAmount} ${finalAmount == 1 ? 'Ticket' : 'Tickets'}`
                    : `${amount} ${amount == 1 ? 'Ticket' : 'Tickets'}`}
                </div>
              </div>
            ) : (
              <div className={'flex flex-row gap-[0.26vw]'}>
                <ClearTicketButton onClick={removeTicket} />
                {voucherMode !== VoucherMode.UseValid && (
                  <TicketsNumPicker
                    amount={amount}
                    setAmount={setAmount}
                    removeTicket={removeTicket}
                  />
                )}
              </div>
            )}
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
        <div className="mt-[1.6vw] flex flex-row justify-between gap-[0.33vw]">
          <AnimatePresence>
            {!finalized &&
              amount > 0 &&
              [1, 2, 3, 4, 5, 6, 7, 8, 9, '←'].map((fieldId, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={
                    index != 9 && symbols.length == 6
                      ? { opacity: 0.6, cursor: 'not-allowed' }
                      : { opacity: 1 }
                  }
                  exit={{ opacity: 0 }}
                  whileHover={
                    symbols.length != 6 || index == 9
                      ? { opacity: 0.6, cursor: 'pointer' }
                      : undefined
                  }
                  className={
                    'relative flex h-[1.6vw] w-[1.6vw] flex-col items-center justify-center'
                  }
                  onClick={() => {
                    setSymbols(
                      fieldId == '←'
                        ? symbols.slice(0, -1)
                        : `${symbols}${fieldId}`
                    );
                  }}
                  disabled={index != 9 && symbols.length == 6}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={'h-[1.6vw] w-[1.6vw]'}
                  >
                    <g opacity="1">
                      <rect
                        x="0.5"
                        y="0.5"
                        width="25"
                        height="25"
                        rx="3.09551"
                        fill="#DCB8FF"
                        stroke="#252525"
                        strokeLinecap="round"
                        strokeDasharray="7.19 3.6"
                      />
                    </g>
                  </svg>
                  <div
                    className={
                      'absolute bottom-px right-px z-[1] flex h-full w-full items-center justify-center '
                    }
                  >
                    <span className={'text-[1vw] text-bg-dark'}>{fieldId}</span>
                  </div>
                </motion.button>
              ))}
          </AnimatePresence>
        </div>
        <AnimatePresence mode={'wait'}>
          {!finalized && amount != 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={
                symbols.length != 0 && symbols.length != 6
                  ? { opacity: 0.6, cursor: 'not-allowed' }
                  : { opacity: 1 }
              }
              exit={{ opacity: 0 }}
              whileHover={{ opacity: 0.8 }}
              className={
                'mb-auto mt-[0.26vw] w-full rounded-[0.26vw] bg-bg-dark py-[0.417vw] text-center font-museo text-[0.833vw] text-foreground'
              }
              disabled={symbols.length != 0 && symbols.length != 6}
              onClick={() => {
                if (symbols.length == 0) {
                  generateRandomNumbers();
                }
                if (symbols.length == 6) {
                  submitTicket();
                }
              }}
            >
              {symbols.length == 0 ? 'Random numbers' : 'Submit ticket number'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
