import { useContext, useState } from 'react';
import {
  useProtokitBalancesStore,
  // useTestBalanceGetter,
} from '@/lib/stores/protokitBalances';
import ChangeSvg from '@/public/image/bridge/change.svg';
import Image from 'next/image';
import { L1_ASSETS, L2_ASSET } from '@/constants/assets';
import { useNetworkStore } from '@/lib/stores/network';
import { useMinaBalancesStore } from '@/lib/stores/minaBalances';
import { motion } from 'framer-motion';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import 'reflect-metadata';
import { AccountUpdate, Mina, PublicKey } from 'o1js';
import { useEffect } from 'react';
import { BRIDGE_ADDR } from '@/app/constants';
import { ProtokitLibrary, ZNAKE_TOKEN_ID } from 'zknoid-chain-dev';
import { formatUnits } from '@/lib/unit';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';
import { type PendingTransaction } from '@proto-kit/sequencer';
import toast from '@/components/shared/Toast';
import { useToasterStore } from '@/lib/stores/toasterStore';
import TopUpCard from './ui/TopUpCard';
import BridgeModal from '@/components/shared/Modal/BridgeModal';
import Popover from '@/components/shared/Popover';
import { useBridgeStore } from '@/lib/stores/bridgeStore';
import BridgeInput from './ui/BridgeInput';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { requestAccounts } from '@/lib/helpers';

export default function DepositMenuItem() {
  const bridgeStore = useBridgeStore();
  const minaBalancesStore = useMinaBalancesStore();
  const protokitBalancesStore = useProtokitBalancesStore();
  const toasterStore = useToasterStore();
  const networkStore = useNetworkStore();
  const { client: contextAppChainClient } = useContext(ZkNoidGameContext);
  const progress = api.progress.setSolvedQuests.useMutation();
  // const testBalanceGetter = useTestBalanceGetter();
  // const balancesStore = useProtokitBalancesStore();
  const network = useNetworkStore();
  const [isUnbridge, setIsUnbridge] = useState(false);
  const rate = 1;

  const [assetIn, setAssetIn] = useState(L1_ASSETS.Mina);
  const [amountIn, setAmountIn] = useState(
    10n * 10n ** BigInt(L1_ASSETS.Mina.decimals)
  );
  const [assetOut, setAssetOut] = useState(L2_ASSET);
  const [amountOut, setAmountOut] = useState(
    10n * 10n ** BigInt(L2_ASSET.decimals)
  );

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
    try {
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
    } catch (e: any) {
      if (e?.code == 1001) {
        await requestAccounts();
        await bridge(amount);
        return;
      }
    }

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

    try {
      const balances = (contextAppChainClient!.runtime as any).resolve(
        'Balances'
      );
      const sender = PublicKey.fromBase58(networkStore.address!);

      const l2tx = await contextAppChainClient!.transaction(
        sender,
        async () => {
          balances.burnBalance(
            ZNAKE_TOKEN_ID,
            ProtokitLibrary.UInt64.from(1000000000n)
          );
        }
      );

      await l2tx.sign();
      await l2tx.send();
    } catch (e: any) {
      if (e?.code == 1001) {
        await requestAccounts();
        await unbridge(amount);
        return;
      }
    }

    await logBridged.mutateAsync({
      userAddress: network.address ?? '',
      amount: amountIn,
      isUnbridged: true,
      envContext: getEnvContext(),
    });
  };

  const { appchainSupported } = useContext(ZkNoidGameContext);

  return (
    <>
      {appchainSupported && (
        <TopUpCard
          text="Top up"
          onClick={() => bridgeStore.setOpen(10n * 10n ** 9n)}
        />
      )}
      <BridgeModal
        isOpen={bridgeStore.open}
        onClose={() => bridgeStore.close()}
      >
        <div className={'flex w-full flex-row justify-between'}>
          <div />
          <div className={'hidden w-full flex-row lg:flex'}>
            <div className="font-museo text-headline-1 text-bg-dark">
              {!isUnbridge ? 'Bridge' : 'Unbridge'}
            </div>
            <Popover
              trigger={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={'hover:opacity-80'}
                >
                  <g opacity="0.5">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      fill="#252525"
                      stroke="#252525"
                      strokeWidth="0.500035"
                    />
                    <path
                      d="M7.24558 9.95291V7.68144C8.03215 7.64451 8.64606 7.45983 9.08731 7.12742C9.53815 6.79501 9.76357 6.33795 9.76357 5.75623V5.56233C9.76357 5.09141 9.61009 4.71745 9.30313 4.44044C8.99618 4.1542 8.58371 4.01108 8.06572 4.01108C7.50937 4.01108 7.06333 4.16343 6.7276 4.46814C6.40146 4.77285 6.18083 5.16066 6.06572 5.63158L5.00098 5.24377C5.08731 4.94829 5.21201 4.66667 5.37508 4.39889C5.54774 4.12188 5.75877 3.88181 6.00817 3.67867C6.26716 3.4663 6.56932 3.30009 6.91465 3.18006C7.25997 3.06002 7.65805 3 8.10889 3C9.00098 3 9.70601 3.23546 10.224 3.70637C10.742 4.17729 11.001 4.8144 11.001 5.61773C11.001 6.06094 10.9194 6.44875 10.7564 6.78116C10.6029 7.10434 10.4015 7.38135 10.1521 7.61219C9.90266 7.84303 9.61968 8.0277 9.30313 8.1662C8.98659 8.30471 8.67004 8.40166 8.35349 8.45706V9.95291H7.24558ZM7.80673 13C7.49978 13 7.27436 12.9261 7.13047 12.7784C6.99618 12.6307 6.92903 12.4367 6.92903 12.1967V12.0166C6.92903 11.7765 6.99618 11.5826 7.13047 11.4349C7.27436 11.2872 7.49978 11.2133 7.80673 11.2133C8.11369 11.2133 8.33431 11.2872 8.4686 11.4349C8.61249 11.5826 8.68443 11.7765 8.68443 12.0166V12.1967C8.68443 12.4367 8.61249 12.6307 8.4686 12.7784C8.33431 12.9261 8.11369 13 7.80673 13Z"
                      fill="#F9F8F4"
                    />
                  </g>
                </svg>
              }
            >
              <div className={'min-w-[200px]'}>
                Bridge your Mina tokens to the platform balance. You can use the
                bridged tokens in games or unbridge them back to Mina network
              </div>
            </Popover>
          </div>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={'cursor-pointer hover:opacity-80'}
            onClick={() => bridgeStore.close()}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.8001 8.99936L1.80078 0L0.000872989 1.79991L9.00023 10.7993L0 19.7995L1.79991 21.5994L10.8001 12.5992L19.7999 21.5989L21.5998 19.799L12.6 10.7993L21.5989 1.80042L19.799 0.000509977L10.8001 8.99936Z"
              fill="#252525"
            />
          </svg>
        </div>
        <div className={'flex w-full flex-row lg:hidden'}>
          <div className="font-museo text-headline-1 text-bg-dark">
            {!isUnbridge ? 'Bridge' : 'Unbridge'}
          </div>
          <Popover
            trigger={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'hover:opacity-80'}
              >
                <g opacity="0.5">
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    fill="#252525"
                    stroke="#252525"
                    strokeWidth="0.500035"
                  />
                  <path
                    d="M7.24558 9.95291V7.68144C8.03215 7.64451 8.64606 7.45983 9.08731 7.12742C9.53815 6.79501 9.76357 6.33795 9.76357 5.75623V5.56233C9.76357 5.09141 9.61009 4.71745 9.30313 4.44044C8.99618 4.1542 8.58371 4.01108 8.06572 4.01108C7.50937 4.01108 7.06333 4.16343 6.7276 4.46814C6.40146 4.77285 6.18083 5.16066 6.06572 5.63158L5.00098 5.24377C5.08731 4.94829 5.21201 4.66667 5.37508 4.39889C5.54774 4.12188 5.75877 3.88181 6.00817 3.67867C6.26716 3.4663 6.56932 3.30009 6.91465 3.18006C7.25997 3.06002 7.65805 3 8.10889 3C9.00098 3 9.70601 3.23546 10.224 3.70637C10.742 4.17729 11.001 4.8144 11.001 5.61773C11.001 6.06094 10.9194 6.44875 10.7564 6.78116C10.6029 7.10434 10.4015 7.38135 10.1521 7.61219C9.90266 7.84303 9.61968 8.0277 9.30313 8.1662C8.98659 8.30471 8.67004 8.40166 8.35349 8.45706V9.95291H7.24558ZM7.80673 13C7.49978 13 7.27436 12.9261 7.13047 12.7784C6.99618 12.6307 6.92903 12.4367 6.92903 12.1967V12.0166C6.92903 11.7765 6.99618 11.5826 7.13047 11.4349C7.27436 11.2872 7.49978 11.2133 7.80673 11.2133C8.11369 11.2133 8.33431 11.2872 8.4686 11.4349C8.61249 11.5826 8.68443 11.7765 8.68443 12.0166V12.1967C8.68443 12.4367 8.61249 12.6307 8.4686 12.7784C8.33431 12.9261 8.11369 13 7.80673 13Z"
                    fill="#F9F8F4"
                  />
                </g>
              </svg>
            }
          >
            <div className={'min-w-[100px]'}>
              Bridge your Mina tokens to the platform balance. You can use the
              bridged tokens in games or unbridge them back to Mina network
            </div>
          </Popover>
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
                ? (minaBalancesStore.balances[networkStore.address!] ?? 0n)
                : (protokitBalancesStore.balances[networkStore.address!] ?? 0n)
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
                ? (protokitBalancesStore.balances[networkStore.address!] ?? 0n)
                : (minaBalancesStore.balances[networkStore.address!] ?? 0n)
            }
            isPay={false}
          />
        </div>
        <button
          className={
            'w-full rounded-[5px] border border-bg-dark bg-bg-dark py-2 text-center text-[16px]/[16px] font-medium text-foreground hover:bg-right-accent hover:text-bg-dark lg:text-[20px]/[20px]'
          }
          onClick={() =>
            isUnbridge
              ? unbridge(amountIn)
                  .then(() =>
                    toast.success(toasterStore, 'Unbridge success', true)
                  )
                  .catch((error) => {
                    console.log(error);
                    toast.error(toasterStore, 'Unbridge error', true);
                  })
              : bridge(amountIn)
                  .then(() =>
                    toast.success(toasterStore, 'Bridge success', true)
                  )
                  .catch((error) => {
                    console.log(error);
                    toast.error(toasterStore, 'Bridge error', true);
                  })
          }
        >
          {isUnbridge ? 'Unbridge' : 'Bridge'}
        </button>
      </BridgeModal>
    </>
  );
}