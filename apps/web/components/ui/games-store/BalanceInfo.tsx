import {
  useMinaBalancesStore,
  useObserveMinaBalance,
} from '@/lib/stores/minaBalances';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import { useNetworkStore } from '@/lib/stores/network';
import { useProtokitBalancesStore } from '@/lib/stores/protokitBalances';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { DepositMenuItem } from '@/components/DepositMenuItem';

export default function BalanceInfo() {
  const minaBalancesStore = useMinaBalancesStore();
  const networkStore = useNetworkStore();
  usePollMinaBlockHeight();
  useObserveMinaBalance();
  const protokitBalancesStore = useProtokitBalancesStore();
  const workerClient = useWorkerClientStore();

  return (
    <>
      {networkStore.walletConnected && (
        <div className="flex flex-col items-center gap-2 text-base lg:flex-row">
          <div className="flex w-full items-end lg:w-auto lg:flex-col">
            <div className={'mt-8 w-full text-start lg:mt-0 lg:w-auto'}>
              Deposit:{' '}
              {(
                Number(
                  protokitBalancesStore.balances[networkStore.address!] ?? 0n
                ) /
                10 ** 9
              ).toFixed(2)}
            </div>
            <div className={'w-full text-end lg:w-auto'}>
              {(
                Number(
                  minaBalancesStore.balances[networkStore.address!] ?? 0n
                ) /
                10 ** 9
              ).toFixed(2)}{' '}
              Mina
            </div>
            <div className="hidden text-[12px] lg:block">
              {workerClient.status}
            </div>
          </div>
          <div className={'flex w-full flex-col gap-2 lg:block lg:w-auto'}>
            <div className="block text-[12px] lg:hidden">
              {workerClient.status}
            </div>
            <DepositMenuItem />
          </div>
        </div>
      )}
    </>
  );
}
