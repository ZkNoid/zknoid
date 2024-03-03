import { useState } from 'react';

import { useMinaBridge } from '@/lib/stores/protokitBalances';
import { HeaderCard } from './ui/games-store/HeaderCard';
import MinaTokenSvg from '@/public/image/tokens/mina.svg';
import ChangeSvg from '@/public/image/bridge/change.svg';

import Image from 'next/image';
import {
  ALL_ZKNOID_L1_ASSETS,
  L1_ASSETS,
  L2_ASSET,
  ZkNoidAsset,
} from '@/constants/assets';

const BridgeInput = ({
  assets,
  onAmountSet,
  isPay,
}: {
  assets: ZkNoidAsset[];
  onAmountSet?: (amount: number) => void;
  isPay: boolean;
}) => {
  const [currentAsset, setCurrentAsset] = useState(assets[0]);
  const [amountToDeposit, setAmountToDeposit] = useState(10);

  return (
    <div className="font-plexsans w-full flex-col">
      <div className="flex w-full flex-row gap-1">
        <div className="flex flex-row rounded border border-left-accent">
          <div className="flex min-w-0 flex-col p-1 text-[14px] text-left-accent">
            {isPay ? 'You pay' : 'You receive'}
            <input
              type="number"
              className="w-full min-w-0 appearance-none bg-bg-dark text-[24px] outline-none"
              value={amountToDeposit}
              onChange={(value) => {
                setAmountToDeposit(parseFloat(value.target.value));
                onAmountSet?.(parseFloat(value.target.value));
              }}
            />
          </div>
          <div className="m-2 flex items-center justify-center gap-1 rounded bg-left-accent p-1 px-2 text-[24px] font-medium text-bg-dark">
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
            <svg
              width="22"
              height="12"
              viewBox="0 0 22 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 1.00098L11 11.001L1 1.00098"
                stroke="#252525"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between ">
        <div>Balance: 500 $MINA</div>
        <div className="m-1 rounded border border-left-accent px-1 text-left-accent">
          MAX
        </div>
      </div>
    </div>
  );
};
export const DepositMenuItem = () => {
  const [expanded, setExpanded] = useState(false);
  const [amountToDeposit, setAmountToDeposit] = useState(10);
  const bridge = useMinaBridge();

  return (
    <>
      <HeaderCard
        svg={'top-up'}
        text="Top up"
        onClick={() => setExpanded(true)}
      />
      {expanded && (
        <div
          className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        >
          <div
            className=" flex w-96 flex-col items-center gap-5 rounded-xl border border-left-accent bg-bg-dark p-7 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[32px]">Bridge</div>
            <div className="flex flex-col items-center gap-1">
              <BridgeInput assets={[L1_ASSETS.Mina]} isPay={true} />
              <Image
                src={ChangeSvg}
                alt="Change"
                className="mb-[5px] mt-[-20px]"
              ></Image>
              <BridgeInput assets={[L2_ASSET]} isPay={false} />
            </div>
            <div
              className="cursor-pointer rounded-xl bg-left-accent px-7 py-3 text-[24px] text-black"
              onClick={() => bridge(amountToDeposit * 10 ** 9)}
            >
              Bridge
            </div>
          </div>
        </div>
      )}
    </>
  );
};
