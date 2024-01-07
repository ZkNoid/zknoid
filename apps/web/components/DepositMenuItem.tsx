import { useMinaBridge } from "@/lib/stores/protokitBalances";
import { useState } from "react";

export const DepositMenuItem = () => {
    const [expanded, setExpanded] = useState(false);
    const [amountToDeposit, setAmountToDeposit] = useState(10);
    const bridge = useMinaBridge(amountToDeposit * 10 ** 9);

    return (
        <>
            <div className="inline ml-3 bg-slate-300 cursor-pointer" onClick={() => setExpanded(!expanded)}>Deposit</div>
            {expanded && (
                <div className="flex flex-col items-center w-40 py-3 absolute bg-slate-200 text-xs rounded-xl top-20 gap-5 ml-7">
                    <input type="number" className="w-20 h-7 text-lg" value={amountToDeposit} onChange={(value) => setAmountToDeposit(parseInt(value.target.value))}></input>
                    <div
                        className="cursor-pointer bg-slate-300 hover:bg-slate-400 py-3 px-7 text-sm rounded-xl"
                        onClick={() => bridge()}
                    >
                        DEPOSIT
                    </div>
                </div>
            )}
        </>
    )
}