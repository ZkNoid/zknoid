import Image from 'next/image';
import MinaCoinImg from '@/components/widgets/Header/nonSSR/BalanceInfo/assets/mina.png';
import {
  useMinaBalancesStore,
  useObserveMinaBalance,
} from '@/lib/stores/minaBalances';
import { useNetworkStore } from '@/lib/stores/network';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import {
  useObserveProtokitBalance,
  useProtokitBalancesStore,
} from '@/lib/stores/protokitBalances';
import CoinImg from '@/components/widgets/Header/nonSSR/BalanceInfo/assets/coin.svg';
import DepositMenuItem from '../../nonSSR/BalanceInfo/StoreDepositMenuItem/nonSSR/DepositMenuItem';
import StoreDepositMenuItem from '../../nonSSR/BalanceInfo/StoreDepositMenuItem';
import { useContext } from 'react';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';

export default function Balance() {
  const minaBalancesStore = useMinaBalancesStore();
  const networkStore = useNetworkStore();
  usePollMinaBlockHeight();
  useObserveMinaBalance();
  useObserveProtokitBalance();
  const protokitBalancesStore = useProtokitBalancesStore();

  const deposit = (
    Number(protokitBalancesStore.balances[networkStore.address!] ?? 0n) /
    10 ** 9
  ).toFixed(2);

  const minaDeposit = (
    Number(minaBalancesStore.balances[networkStore.address!] ?? 0n) /
    10 ** 9
  ).toFixed(2);

  const { appchainSupported } = useContext(ZkNoidGameContext);

  return (
    <div className="flex items-center gap-[10px]">
      <StoreDepositMenuItem />
      <Image
        alt=""
        src={!appchainSupported ? MinaCoinImg : CoinImg}
        width={26}
        height={26}
      />
      <div
        className={
          !appchainSupported
            ? 'w-full text-end lg:w-auto'
            : 'w-full text-start lg:w-auto'
        }
      >
        {!appchainSupported && <>Wallet balance {minaDeposit}</>}
        {appchainSupported && (
          <div className="w-full text-start lg:w-auto">Deposit: {deposit}</div>
        )}
      </div>
    </div>
  );
}
