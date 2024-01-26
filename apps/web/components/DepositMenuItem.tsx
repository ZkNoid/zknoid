import { useMinaBridge } from '@/lib/stores/protokitBalances';
import { useState } from 'react';

export const DepositMenuItem = () => {
  const [expanded, setExpanded] = useState(false);
  const [amountToDeposit, setAmountToDeposit] = useState(10);
  const bridge = useMinaBridge();

  return (
    <>
      <div
        className="ml-3 inline cursor-pointer bg-slate-300"
        onClick={() => setExpanded(!expanded)}
      >
        Deposit
      </div>
      {expanded && (
        <div className="absolute top-20 ml-7 flex w-40 flex-col items-center gap-5 rounded-xl bg-slate-200 py-3 text-xs">
          <input
            type="number"
            className="h-7 w-20 text-lg"
            value={amountToDeposit}
            onChange={(value) =>
              setAmountToDeposit(parseInt(value.target.value))
            }
          ></input>
          <div
            className="cursor-pointer rounded-xl bg-slate-300 px-7 py-3 text-sm hover:bg-slate-400"
            onClick={() => bridge(amountToDeposit * 10 ** 9)}
          >
            DEPOSIT
          </div>
        </div>
      )}
    </>
  );
};
