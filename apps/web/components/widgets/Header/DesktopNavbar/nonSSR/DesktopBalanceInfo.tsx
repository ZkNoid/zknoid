import Image from 'next/image';
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
import CoinImg from '@/components/widgets/Header/assets/coin.svg';
import MinaCoinImg from '@/components/widgets/Header/assets/mina.png';
import { useContext } from 'react';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import DepositMenuItem from '../../nonSSR/DepositMenuItem/DepositMenuItems';

export default function DesktopBalanceInfo() {
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
    <div className="flex items-center gap-[0.521vw]">
      <Image
        alt=""
        src={!appchainSupported ? MinaCoinImg : CoinImg}
        className={'h-[1.354vw] w-[1.354vw]'}
      />
      <div
        className={
          !appchainSupported
            ? 'w-full text-end lg:w-auto'
            : 'w-full text-start lg:w-auto'
        }
      >
        {!appchainSupported && (
          <div className={'font-museo text-[0.833vw] font-medium'}>
            Wallet balance: {minaDeposit}
          </div>
        )}
        {appchainSupported && (
          <div className="w-full text-start font-museo text-[0.833vw] font-medium lg:w-auto">
            Deposit: {deposit}
          </div>
        )}
      </div>
      {appchainSupported && <DepositMenuItem />}
    </div>
  );
}
