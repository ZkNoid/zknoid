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
        <div className="flex items-center gap-5 text-base">
          <div className="flex flex-col items-end">
            <div>
              Deposit:{' '}
              {(
                Number(
                  protokitBalancesStore.balances[networkStore.address!] ?? 0n
                ) /
                10 ** 9
              ).toFixed(2)}
            </div>
            <div>
              {(
                Number(
                  minaBalancesStore.balances[networkStore.address!] ?? 0n
                ) /
                10 ** 9
              ).toFixed(2)}{' '}
              Mina
            </div>
            <div className="text-[12px]">{workerClient.status}</div>
          </div>
          <div>
            <DepositMenuItem />
          </div>
        </div>
      )}
    </>
  );
}
