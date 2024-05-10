import { useContext, useMemo, useState } from 'react';

import {
  useBridgeStore,
  useMinaBridge,
  useProtokitBalancesStore,
  useTestBalanceGetter,
} from '@/lib/stores/protokitBalances';
import { HeaderCard } from './ui/games-store/HeaderCard';
import MinaTokenSvg from '@/public/image/tokens/mina.svg';
import ChangeSvg from '@/public/image/bridge/change.svg';

import Image from 'next/image';
import { L1_ASSETS, L2_ASSET, ZkNoidAsset } from '@/constants/assets';
import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBalancesStore } from '@/lib/stores/minaBalances';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import 'reflect-metadata';
import { AccountUpdate, Mina, PublicKey } from 'o1js';
import { useEffect } from 'react';
import { BRIDGE_ADDR } from '@/app/constants';
import { ProtokitLibrary, ZNAKE_TOKEN_ID } from 'zknoid-chain-dev';
import { formatUnits } from '@/lib/unit';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';
import { DefaultRuntimeModules } from '@/lib/runtimeModules';
import { buildClient } from '@/lib/utils';
import { type PendingTransaction } from '@proto-kit/sequencer';
import { Button } from '@/components/ui/games-store/shared/Button';

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
  amount: bigint;
  setAmount?: (amount: bigint) => void;
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
  const bridgeStore = useBridgeStore();

  const [assetIn, setAssetIn] = useState(L1_ASSETS.Mina);
  const [amountIn, setAmountIn] = useState(
    10n * 10n ** BigInt(L1_ASSETS.Mina.decimals)
  );
  const [assetOut, setAssetOut] = useState(L2_ASSET);
  const [amountOut, setAmountOut] = useState(
    10n * 10n ** BigInt(L2_ASSET.decimals)
  );

  const minaBalancesStore = useMinaBalancesStore();
  const protokitBalancesStore = useProtokitBalancesStore();

  const networkStore = useNetworkStore();

  const contextAppChainClient = useContext(AppChainClientContext);
  const progress = api.progress.setSolvedQuests.useMutation();

  useEffect(() => {
    setAmountIn(bridgeStore.amount);
    setAmountOut(bridgeStore.amount);
  }, [bridgeStore.amount]);

  useEffect(() => {
    const newBalance = protokitBalancesStore.balances[networkStore.address!];
    if (bridgeStore.amount > 0 && newBalance >= bridgeStore.amount) {
      console.log('[Balance update finished!]');
      bridgeStore.close();
    }
    console.log('Balance update');
  }, [protokitBalancesStore.balances[networkStore.address!]]);

  const logBridged = api.logging.logBridged.useMutation();

  const bridge = async (amount: bigint) => {
    console.log('Bridging', amount);
    const l1tx = await Mina.transaction(async () => {
      const senderUpdate = AccountUpdate.create(
        PublicKey.fromBase58(networkStore.address!)
      );
      senderUpdate.requireSignature();
      console.log(BRIDGE_ADDR);
      console.log(amountIn);
      senderUpdate.send({
        to: PublicKey.fromBase58(BRIDGE_ADDR),
        amount: Number(amount),
      });
    });

    await l1tx.prove();

    const transactionJSON = l1tx.toJSON();

    const data = await (window as any).mina.sendPayment({
      transaction: transactionJSON,
      memo: `zknoid.io game bridging #${process.env.BRIDGE_ID ?? 100}`,
      to: BRIDGE_ADDR,
      amount: formatUnits(amountIn, assetIn.decimals),
    });

    const balances = (contextAppChainClient!.runtime as any).resolve(
      'Balances'
    );
    const sender = PublicKey.fromBase58(networkStore.address!);

    const l2tx = await contextAppChainClient!.transaction(sender, async () => {
      balances.addBalance(
        ZNAKE_TOKEN_ID,
        sender,
        ProtokitLibrary.UInt64.from(amountOut)
      );
    });

    await l2tx.sign();
    await l2tx.send();

    await logBridged.mutateAsync({
      userAddress: network.address ?? '',
      amount: amountIn,
      isUnbridged: false,
      envContext: getEnvContext(),
    });

    if (amountIn >= 50n * 10n ** BigInt(L2_ASSET.decimals))
      await progress.mutateAsync({
        userAddress: networkStore.address!,
        section: 'UI_TESTS_WEB',
        id: 2,
        txHash: JSON.stringify(
          (l2tx.transaction! as PendingTransaction).toJSON()
        ),
        envContext: getEnvContext(),
      });
  };

  const unbridge = async (amount: bigint) => {
    console.log('Burning', amount);
    const balances = (contextAppChainClient!.runtime as any).resolve(
      'Balances'
    );
    const sender = PublicKey.fromBase58(networkStore.address!);

    const l2tx = await contextAppChainClient!.transaction(sender, async () => {
      balances.burnBalance(
        ZNAKE_TOKEN_ID,
        ProtokitLibrary.UInt64.from(1000000000n)
      );
    });

    await l2tx.sign();
    await l2tx.send();

    await logBridged.mutateAsync({
      userAddress: network.address ?? '',
      amount: amountIn,
      isUnbridged: true,
      envContext: getEnvContext(),
    });
  };

  const testBalanceGetter = useTestBalanceGetter();
  const balancesStore = useProtokitBalancesStore();
  const network = useNetworkStore();
  const [isUnbridge, setIsUnbridge] = useState(false);
  const rate = 1;
  return (
    <>
      <HeaderCard
        svg={'top-up'}
        text="Top up"
        onClick={() => bridgeStore.setOpen(10n * 10n ** 9n)}
      />
      {contextAppChainClient &&
        network.address &&
        balancesStore.balances[network.address] < 100 * 10 ** 9 && (
          <HeaderCard
            svg={'top-up'}
            text="Get test balance"
            onClick={() => testBalanceGetter()}
          />
        )}
      <AnimatePresence>
        {bridgeStore.open && (
          <motion.div
            className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-sm"
            onClick={() => bridgeStore.close()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="flex w-96 flex-col items-center gap-5 rounded-xl border border-left-accent bg-bg-dark p-7 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[32px]">
                {!isUnbridge ? 'Bridge' : 'Unbridge'}
              </div>
              <div className="flex flex-col items-center gap-1">
                <BridgeInput
                  assets={!isUnbridge ? [L1_ASSETS.Mina] : [L2_ASSET]}
                  currentAsset={!isUnbridge ? assetIn : assetOut}
                  setCurrentAsset={setAssetIn}
                  amount={amountIn}
                  setAmount={(amount) => {
                    setAmountIn(amount || 0n);
                    setAmountOut(amount * BigInt(rate) || 0n);
                  }}
                  balance={
                    !isUnbridge
                      ? minaBalancesStore.balances[networkStore.address!] ?? 0n
                      : protokitBalancesStore.balances[networkStore.address!] ??
                        0n
                  }
                  isPay={true}
                />
                <motion.div
                  className="mb-[5px] mt-[-20px] hover:opacity-80"
                  whileTap={{ scale: 0.8 }}
                >
                  <Image
                    src={ChangeSvg}
                    alt="Change"
                    onClick={() => setIsUnbridge(!isUnbridge)}
                  />
                </motion.div>
                <BridgeInput
                  assets={!isUnbridge ? [L2_ASSET] : [L1_ASSETS.Mina]}
                  currentAsset={!isUnbridge ? assetOut : assetIn}
                  setCurrentAsset={setAssetOut}
                  amount={amountOut}
                  setAmount={(amount) => {
                    setAmountIn(amount / BigInt(rate) || 0n);
                    setAmountOut(amount || 0n);
                  }}
                  balance={
                    !isUnbridge
                      ? protokitBalancesStore.balances[networkStore.address!] ??
                        0n
                      : minaBalancesStore.balances[networkStore.address!] ?? 0n
                  }
                  isPay={false}
                />
              </div>
              <Button
                label={isUnbridge ? 'Unbridge' : 'Bridge'}
                onClick={() =>
                  isUnbridge ? unbridge(amountIn) : bridge(amountIn)
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
