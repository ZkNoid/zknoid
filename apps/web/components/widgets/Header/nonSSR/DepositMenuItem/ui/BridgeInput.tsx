import { ZkNoidAsset } from '@/constants/assets';
import { formatUnits } from '@/lib/unit';
import Image from 'next/image';

export default function BridgeInput({
  assets,
  currentAsset,
  setCurrentAsset,
  amount,
  setAmount,
  balance,
  isPay,
}: {
  assets: ZkNoidAsset[];
  currentAsset: ZkNoidAsset;
  setCurrentAsset: (asset: ZkNoidAsset) => void;
  amount: bigint;
  setAmount?: (amount: bigint) => void;
  balance: bigint;
  isPay: boolean;
}) {
  return (
    <div className="w-full flex-col font-plexsans">
      <div className="flex w-full flex-row gap-1">
        <div className="flex flex-row rounded bg-bg-dark">
          <div className="flex min-w-0 flex-col bg-bg-dark p-1 text-[14px]">
            {isPay ? 'You pay' : 'You receive'}
            <input
              type="number"
              className="w-full min-w-0 appearance-none bg-bg-dark text-[24px] outline-none"
              value={formatUnits(amount, currentAsset.decimals)}
              onChange={(value) => {
                setAmount?.(
                  BigInt(
                    parseFloat(value.target.value) *
                      10 ** currentAsset.decimals || 0
                  )
                );
              }}
              step="0.01"
              placeholder="0.00"
            />
          </div>
          <div className="m-2 flex items-center justify-center gap-1 rounded bg-right-accent p-1 px-2 text-[24px] font-medium text-bg-dark">
            {currentAsset.icon ? (
              <div className="h-[26px] w-[26px]">
                <Image
                  className="h-[26px] w-[26px]"
                  src={currentAsset.icon}
                  alt={currentAsset.ticker}
                  width={26}
                  height={26}
                ></Image>
              </div>
            ) : (
              <div className="h-[26px] w-[26px] rounded-3xl bg-bg-dark"></div>
            )}
            {currentAsset.ticker}
            {/*<svg*/}
            {/*  width="22"*/}
            {/*  height="12"*/}
            {/*  viewBox="0 0 22 12"*/}
            {/*  fill="none"*/}
            {/*  xmlns="http://www.w3.org/2000/svg"*/}
            {/*>*/}
            {/*  <path*/}
            {/*    d="M21 1.00098L11 11.001L1 1.00098"*/}
            {/*    stroke="#252525"*/}
            {/*    stroke-width="2"*/}
            {/*    stroke-linecap="round"*/}
            {/*    stroke-linejoin="round"*/}
            {/*  />*/}
            {/*</svg>*/}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between text-bg-dark">
        <div>
          Balance: {(Number(balance) / 10 ** 9).toFixed(2)}{' '}
          {currentAsset.ticker}
        </div>
        <div className="m-1 rounded border border-bg-dark px-1">MAX</div>
      </div>
    </div>
  );
}