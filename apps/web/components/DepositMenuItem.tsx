import { useState } from 'react';

import {
  useMinaBridge,
  useProtokitBalancesStore,
  useTestBalanceGetter,
} from '@/lib/stores/protokitBalances';
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
import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBalancesStore } from '@/lib/stores/minaBalances';
import { AnimatePresence, motion } from 'framer-motion';

const BridgeInput = ({
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
  amount: number;
  setAmount?: (amount: number) => void;
  balance: bigint;
  isPay: boolean;
}) => {
  return (
    <div className="w-full flex-col font-plexsans">
      <div className="flex w-full flex-row gap-1">
        <div className="flex flex-row rounded border border-left-accent">
          <div className="flex min-w-0 flex-col p-1 text-[14px] text-left-accent">
            {isPay ? 'You pay' : 'You receive'}
            <input
              type="number"
              className="w-full min-w-0 appearance-none bg-bg-dark text-[24px] outline-none"
              value={amount}
              onChange={(value) => {
                setAmount?.(parseFloat(value.target.value));
              }}
              step="0.01"
              placeholder="0.00"
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
        <div>
          Balance: {(Number(balance) / 10 ** 9).toFixed(2)}{' '}
          {currentAsset.ticker}
        </div>
        <div className="m-1 rounded border border-left-accent px-1 text-left-accent">
          MAX
        </div>
      </div>
    </div>
  );
};
export const DepositMenuItem = () => {
  const [expanded, setExpanded] = useState(false);
  const [assetIn, setAssetIn] = useState(L1_ASSETS.Mina);
  const [amountIn, setAmountIn] = useState(10);
  const [assetOut, setAssetOut] = useState(L2_ASSET);
  const [amountOut, setAmountOut] = useState(10);

  const minaBalancesStore = useMinaBalancesStore();
  const protokitBalancesStore = useProtokitBalancesStore();

  const networkStore = useNetworkStore();

  const bridge = useMinaBridge();
  const testBalanceGetter = useTestBalanceGetter();
  const rate = 1;

  return (
    <>
      <HeaderCard
        svg={'top-up'}
        text="Top up"
        onClick={() => setExpanded(true)}
      />
      <HeaderCard
        svg={'top-up'}
        text="Get test balance"
        onClick={() => testBalanceGetter()}
      />
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-sm"
            onClick={() => setExpanded(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="flex w-96 flex-col items-center gap-5 rounded-xl border border-left-accent bg-bg-dark p-7 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[32px]">Bridge</div>
              <div className="flex flex-col items-center gap-1">
                <BridgeInput
                  assets={[L1_ASSETS.Mina]}
                  currentAsset={assetIn}
                  setCurrentAsset={setAssetIn}
                  amount={amountIn}
                  setAmount={(amount) => {
                    setAmountIn(amount);
                    setAmountOut(amount * rate);
                  }}
                  balance={
                    minaBalancesStore.balances[networkStore.address!] ?? 0n
                  }
                  isPay={true}
                />
                <Image
                  src={ChangeSvg}
                  alt="Change"
                  className="mb-[5px] mt-[-20px]"
                ></Image>
                <BridgeInput
                  assets={[L2_ASSET]}
                  currentAsset={assetOut}
                  setCurrentAsset={setAssetOut}
                  amount={amountOut}
                  setAmount={(amount) => {
                    setAmountIn(amount / rate);
                    setAmountOut(amount);
                  }}
                  balance={
                    protokitBalancesStore.balances[networkStore.address!] ?? 0n
                  }
                  isPay={false}
                />
              </div>
              <div
                className="cursor-pointer rounded-xl bg-left-accent px-7 py-3 text-[24px] text-black"
                onClick={() => bridge(amountIn * 10 ** 9)}
              >
                Bridge
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
