import Image from 'next/image';
import MinaCoinImg from '@/components/widgets/Header/nonSSR/BalanceInfo/assets/mina.png';
import {
  useMinaBalancesStore,
  useObserveMinaBalance,
} from '@/lib/stores/minaBalances';
import { useNetworkStore } from '@/lib/stores/network';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import { useProtokitBalancesStore } from '@/lib/stores/protokitBalances';
import CoinImg from '@/components/widgets/Header/nonSSR/BalanceInfo/assets/coin.svg';

export default function Balance({ network }: { network: 'protokit' | 'L1' }) {
  const minaBalancesStore = useMinaBalancesStore();
  const networkStore = useNetworkStore();
  usePollMinaBlockHeight();
  useObserveMinaBalance();
  const protokitBalancesStore = useProtokitBalancesStore();

  const deposit = (
    Number(protokitBalancesStore.balances[networkStore.address!] ?? 0n) /
    10 ** 9
  ).toFixed(2);

  const minaDeposit = (
    Number(minaBalancesStore.balances[networkStore.address!] ?? 0n) /
    10 ** 9
  ).toFixed(2);

  if (network === 'L1') {
    return (
      <div className="flex items-center gap-[10px]">
        <Image alt="" src={MinaCoinImg} width={26} height={26} />
        <div className="w-full text-end lg:w-auto">
          Wallet balance {minaDeposit}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-[10px]">
        <Image alt="" src={CoinImg} width={26} height={26} />
        <div className="w-full text-start lg:w-auto">Deposit: {deposit}</div>
      </div>
    );
  }
}
