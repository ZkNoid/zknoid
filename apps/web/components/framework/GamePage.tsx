'use client';

import { type RuntimeModulesRecord } from '@proto-kit/module';
import { type ClientAppChain } from '@proto-kit/sdk';
import { ReactNode, useState } from 'react';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { ZkNoidGameConfig } from '@/lib/createConfig';
import { useObserveMinaBalance } from '@/lib/stores/minaBalances';
import { usePollMinaBlockHeight } from '@/lib/stores/minaChain';
import { useNetworkStore } from '@/lib/stores/network';
import { useObserveProtokitBalance } from '@/lib/stores/protokitBalances';
import { usePollProtokitBlockHeight } from '@/lib/stores/protokitChain';
import Image from 'next/image';
import { clsx } from 'clsx';
import Link from 'next/link';
import { useSwitchWidgetStorage } from '@/lib/stores/switchWidgetStorage';
import ToastContainer from '@/components/shared/Toast/ui/ToastContainer';
import { cn } from '@/lib/helpers';
import Header from '@/components/widgets/Header';
import Footer from '@/components/widgets/Footer';

const Updater = () => {
  usePollMinaBlockHeight();
  usePollProtokitBlockHeight();
  useObserveMinaBalance();

  return <></>;
};

enum Pages {
  CompetitionsList = 'Competitions List',
  Game = 'Game',
  NewCompetition = 'New Competition',
  Lobby = 'Lobby list',
}

const SwitchBtn = ({
  gameId,
  title,
  switchPage,
  startContent,
  className,
  defaultPage,
}: {
  gameId: string;
  title: string;
  switchPage: Pages;
  startContent?: (selected: boolean) => ReactNode;
  className?: string;
  defaultPage: string;
}) => {
  const switchStore = useSwitchWidgetStorage();
  const [page, _setPage] = useState<string>(defaultPage);

  return (
    <Link
      className={clsx(
        'group relative -mt-2 flex h-[50px] w-full flex-col items-start justify-center rounded-t-[10px] border-x border-t border-left-accent py-2 pl-2 pr-12 first:pb-4 lg:-mr-[70px] lg:-mt-0 lg:w-[420px] lg:items-center lg:rounded-none lg:border-none lg:py-0 lg:pl-0 lg:first:pb-0 lg:last:pr-12',
        className
      )}
      href={
        switchPage === Pages.CompetitionsList
          ? `/games/${gameId}/competitions-list`
          : switchPage === Pages.NewCompetition
            ? `/games/${gameId}/new-competition`
            : switchPage == Pages.Lobby
              ? `/games/${gameId}/lobby/undefined`
              : `/games/${gameId}/${switchStore.competitionId}`
      }
    >
      <Updater />
      <div className={'flex items-center justify-center gap-2'}>
        {startContent?.(page === switchPage)}
        <span
          className={cn(
            'text-[20px]/[20px] group-hover:opacity-80 lg:text-headline-3',
            page === switchPage && 'text-left-accent'
          )}
        >
          {title}
        </span>
      </div>
      <div className={'absolute left-0 top-0 -z-20 hidden h-full lg:block'}>
        <svg
          width="422"
          height="186"
          viewBox="0 0 422 186"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 31V108.456V155C1 171.569 14.4315 185 31 185H391C407.569 185 421 171.569 421 155V65.0353C421 55.3352 416.31 46.2337 408.41 40.6042L360.651 6.56893C355.568 2.9467 349.482 1 343.24 1H31C14.4315 1 1 14.4314 1 31Z"
            fill="#252525"
            stroke="#D2FF00"
            strokeWidth="2"
          />
        </svg>
      </div>
    </Link>
  );
};

const WidgetsSwitch = (props: {
  competitionsSupported: boolean;
  lobbiesSupported: boolean;
  defaultPage: string;
  gameId: string;
  gameName: string;
}) => {
  return (
    <div className={'-mb-4 flex flex-col lg:-mb-0 lg:flex-row'}>
      {props.competitionsSupported &&
        props.defaultPage !== Pages.NewCompetition && (
          <SwitchBtn
            gameId={props.gameId}
            defaultPage={props.defaultPage}
            title={Pages.CompetitionsList}
            switchPage={Pages.CompetitionsList}
            startContent={(selected) => (
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={selected ? 'fill-left-accent' : 'fill-[#F9F8F4]'}
              >
                <g clipPath="url(#clip0_3204_7476)">
                  <path
                    d="M15 9.00048H34.5C34.8978 9.00048 35.2794 8.84245 35.5607 8.56114C35.842 8.27984 36 7.89831 36 7.50049C36 7.10266 35.842 6.72113 35.5607 6.43983C35.2794 6.15852 34.8978 6.00049 34.5 6.00049H15C14.6022 6.00049 14.2206 6.15852 13.9393 6.43983C13.658 6.72113 13.5 7.10266 13.5 7.50049C13.5 7.89831 13.658 8.27984 13.9393 8.56114C14.2206 8.84245 14.6022 9.00048 15 9.00048Z"
                    className={'group-hover:opacity-80'}
                  />
                  <path
                    d="M34.5 16.4995H15C14.6022 16.4995 14.2206 16.6576 13.9393 16.9389C13.658 17.2202 13.5 17.6017 13.5 17.9996C13.5 18.3974 13.658 18.7789 13.9393 19.0602C14.2206 19.3415 14.6022 19.4996 15 19.4996H34.5C34.8978 19.4996 35.2794 19.3415 35.5607 19.0602C35.842 18.7789 36 18.3974 36 17.9996C36 17.6017 35.842 17.2202 35.5607 16.9389C35.2794 16.6576 34.8978 16.4995 34.5 16.4995Z"
                    className={'group-hover:opacity-80'}
                  />
                  <path
                    d="M34.5 27H15C14.6022 27 14.2206 27.158 13.9393 27.4393C13.658 27.7206 13.5 28.1022 13.5 28.5C13.5 28.8978 13.658 29.2794 13.9393 29.5607C14.2206 29.842 14.6022 30 15 30H34.5C34.8978 30 35.2794 29.842 35.5607 29.5607C35.842 29.2794 36 28.8978 36 28.5C36 28.1022 35.842 27.7206 35.5607 27.4393C35.2794 27.158 34.8978 27 34.5 27Z"
                    className={'group-hover:opacity-80'}
                  />
                  <path
                    d="M9.13087 9.00038C9.27927 9.00035 9.42433 8.9563 9.54768 8.87379C9.67103 8.79128 9.76714 8.67403 9.82383 8.53688C9.88052 8.39974 9.89525 8.24885 9.86615 8.10333C9.83705 7.95781 9.76544 7.82419 9.66037 7.71938L6.00037 4.06088C5.71907 3.77968 5.33761 3.6217 4.93987 3.6217C4.54212 3.6217 4.16066 3.77968 3.87937 4.06088L0.220866 7.71938C0.115796 7.82419 0.0441806 7.95781 0.0150829 8.10333C-0.0140149 8.24885 0.000713419 8.39974 0.0574036 8.53688C0.114094 8.67403 0.210197 8.79128 0.333551 8.87379C0.456905 8.9563 0.601963 9.00035 0.750366 9.00038H3.44137V27.0004H0.750366C0.601835 27.0001 0.456569 27.044 0.332986 27.1264C0.209402 27.2087 0.113065 27.326 0.0561892 27.4632C-0.000687102 27.6004 -0.0155418 27.7514 0.0135084 27.8971C0.0425586 28.0427 0.114205 28.1765 0.219366 28.2814L3.87937 31.9399C4.16066 32.2211 4.54212 32.3791 4.93987 32.3791C5.33761 32.3791 5.71907 32.2211 6.00037 31.9399L9.66037 28.2814C9.76544 28.1766 9.83705 28.043 9.86615 27.8974C9.89525 27.7519 9.88052 27.601 9.82383 27.4639C9.76714 27.3267 9.67103 27.2095 9.54768 27.127C9.42433 27.0445 9.27927 27.0004 9.13087 27.0004H6.44137V9.00038H9.13087Z"
                    className={'group-hover:opacity-80'}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3204_7476">
                    <rect width="36" height="36" />
                  </clipPath>
                </defs>
              </svg>
            )}
          />
        )}
      {props.lobbiesSupported && (
        <SwitchBtn
          gameId={props.gameId}
          defaultPage={props.defaultPage}
          title={Pages.Lobby}
          switchPage={Pages.Lobby}
          startContent={(selected) => (
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                'group-hover:opacity-80',
                selected ? 'fill-left-accent' : 'fill-[#F9F8F4]'
              )}
            >
              <g clipPath="url(#clip0_3204_7476)">
                <path d="M15 9.00048H34.5C34.8978 9.00048 35.2794 8.84245 35.5607 8.56114C35.842 8.27984 36 7.89831 36 7.50049C36 7.10266 35.842 6.72113 35.5607 6.43983C35.2794 6.15852 34.8978 6.00049 34.5 6.00049H15C14.6022 6.00049 14.2206 6.15852 13.9393 6.43983C13.658 6.72113 13.5 7.10266 13.5 7.50049C13.5 7.89831 13.658 8.27984 13.9393 8.56114C14.2206 8.84245 14.6022 9.00048 15 9.00048Z" />
                <path d="M34.5 16.4995H15C14.6022 16.4995 14.2206 16.6576 13.9393 16.9389C13.658 17.2202 13.5 17.6017 13.5 17.9996C13.5 18.3974 13.658 18.7789 13.9393 19.0602C14.2206 19.3415 14.6022 19.4996 15 19.4996H34.5C34.8978 19.4996 35.2794 19.3415 35.5607 19.0602C35.842 18.7789 36 18.3974 36 17.9996C36 17.6017 35.842 17.2202 35.5607 16.9389C35.2794 16.6576 34.8978 16.4995 34.5 16.4995Z" />
                <path d="M34.5 27H15C14.6022 27 14.2206 27.158 13.9393 27.4393C13.658 27.7206 13.5 28.1022 13.5 28.5C13.5 28.8978 13.658 29.2794 13.9393 29.5607C14.2206 29.842 14.6022 30 15 30H34.5C34.8978 30 35.2794 29.842 35.5607 29.5607C35.842 29.2794 36 28.8978 36 28.5C36 28.1022 35.842 27.7206 35.5607 27.4393C35.2794 27.158 34.8978 27 34.5 27Z" />
                <path d="M9.13087 9.00038C9.27927 9.00035 9.42433 8.9563 9.54768 8.87379C9.67103 8.79128 9.76714 8.67403 9.82383 8.53688C9.88052 8.39974 9.89525 8.24885 9.86615 8.10333C9.83705 7.95781 9.76544 7.82419 9.66037 7.71938L6.00037 4.06088C5.71907 3.77968 5.33761 3.6217 4.93987 3.6217C4.54212 3.6217 4.16066 3.77968 3.87937 4.06088L0.220866 7.71938C0.115796 7.82419 0.0441806 7.95781 0.0150829 8.10333C-0.0140149 8.24885 0.000713419 8.39974 0.0574036 8.53688C0.114094 8.67403 0.210197 8.79128 0.333551 8.87379C0.456905 8.9563 0.601963 9.00035 0.750366 9.00038H3.44137V27.0004H0.750366C0.601835 27.0001 0.456569 27.044 0.332986 27.1264C0.209402 27.2087 0.113065 27.326 0.0561892 27.4632C-0.000687102 27.6004 -0.0155418 27.7514 0.0135084 27.8971C0.0425586 28.0427 0.114205 28.1765 0.219366 28.2814L3.87937 31.9399C4.16066 32.2211 4.54212 32.3791 4.93987 32.3791C5.33761 32.3791 5.71907 32.2211 6.00037 31.9399L9.66037 28.2814C9.76544 28.1766 9.83705 28.043 9.86615 27.8974C9.89525 27.7519 9.88052 27.601 9.82383 27.4639C9.76714 27.3267 9.67103 27.2095 9.54768 27.127C9.42433 27.0445 9.27927 27.0004 9.13087 27.0004H6.44137V9.00038H9.13087Z" />
              </g>
              <defs>
                <clipPath id="clip0_3204_7476">
                  <rect width="36" height="36" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        />
      )}
      {props.defaultPage === 'New Competition' ? (
        <></>
      ) : (
        <SwitchBtn
          title={props.gameName}
          switchPage={Pages.Game}
          gameId={props.gameId}
          defaultPage={props.defaultPage}
          startContent={(selected) => (
            <svg
              width="32"
              height="36"
              viewBox="0 0 32 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                'group-hover:opacity-80',
                selected ? 'fill-left-accent' : 'fill-[#F9F8F4]'
              )}
            >
              <path d="M28.5817 19.0502L26.8868 18.0003L28.5832 16.9503C29.7612 16.2499 30.6733 15.1784 31.1767 13.9038C31.4918 13.0611 31.6093 12.1572 31.52 11.2619C31.4307 10.3666 31.1371 9.50369 30.6618 8.73972C30.1865 7.97576 29.5422 7.33109 28.7785 6.8554C28.0148 6.3797 27.152 6.08566 26.2568 5.99594C24.8908 5.88421 23.5264 6.22926 22.3778 6.97693L21.7763 7.35042V6.25844C21.8017 4.73559 21.2633 3.25712 20.2645 2.10722C19.2658 0.957323 17.8773 0.217165 16.3659 0.0290296C15.5323 -0.0532721 14.6907 0.0398967 13.8952 0.302538C13.0998 0.56518 12.3682 0.991474 11.7475 1.55398C11.1267 2.11648 10.6307 2.80273 10.2912 3.56854C9.95177 4.33436 9.77644 5.16277 9.77651 6.00044V7.35042L9.17652 6.97543C8.02814 6.22565 6.66306 5.87897 5.29608 5.98994C4.40065 6.07888 3.53761 6.37224 2.77347 6.84741C2.00934 7.32259 1.36452 7.96689 0.888734 8.73064C0.412945 9.4944 0.118892 10.3572 0.0292415 11.2526C-0.060409 12.1479 0.056738 13.0519 0.371652 13.8948C0.875101 15.1698 1.7879 16.2415 2.96661 16.9413L4.66609 18.0003L2.96961 19.0502C1.79168 19.7506 0.87951 20.8221 0.376152 22.0967C0.0606217 22.9401 -0.0568659 23.8448 0.0327594 24.7408C0.122385 25.6369 0.416725 26.5003 0.893058 27.2645C1.36939 28.0288 2.01497 28.6733 2.77996 29.1484C3.54496 29.6235 4.40889 29.9164 5.30508 30.0046C6.66802 30.116 8.02945 29.7726 9.17652 29.0281L9.77651 28.6501V30.0001C9.77651 31.5914 10.4086 33.1175 11.5338 34.2427C12.659 35.3679 14.1851 36 15.7764 36C17.3677 36 18.8938 35.3679 20.019 34.2427C21.1442 33.1175 21.7763 31.5914 21.7763 30.0001V28.6501L22.3763 29.0266C23.5227 29.7716 24.8835 30.116 26.2463 30.0061C27.1422 29.9175 28.0058 29.6243 28.7704 29.149C29.535 28.6737 30.1802 28.0291 30.6562 27.265C31.1323 26.5008 31.4263 25.6375 31.5158 24.7417C31.6052 23.8458 31.4877 22.9414 31.1722 22.0982C30.6697 20.8236 29.7586 19.7517 28.5817 19.0502ZM28.1152 25.6772C27.7122 26.3239 27.0687 26.7841 26.3264 26.9566C25.5841 27.129 24.8037 26.9995 24.1568 26.5966L21.0683 24.6737C20.841 24.5323 20.58 24.4544 20.3124 24.448C20.0448 24.4415 19.7804 24.5068 19.5465 24.6371C19.3127 24.7673 19.1179 24.9578 18.9825 25.1887C18.8471 25.4195 18.7759 25.6825 18.7764 25.9501V30.0001C18.7764 30.7957 18.4603 31.5588 17.8977 32.1214C17.3351 32.684 16.5721 33 15.7764 33C14.9808 33 14.2177 32.684 13.6551 32.1214C13.0925 31.5588 12.7765 30.7957 12.7765 30.0001V25.9501C12.7764 25.6827 12.7048 25.4202 12.5692 25.1897C12.4336 24.9592 12.2388 24.7692 12.005 24.6393C11.7713 24.5095 11.507 24.4444 11.2397 24.451C10.9723 24.4576 10.7116 24.5355 10.4845 24.6767L7.39605 26.6026C7.07576 26.8021 6.71932 26.9365 6.34709 26.9982C5.97486 27.0599 5.59412 27.0476 5.22661 26.9622C4.85911 26.8767 4.51203 26.7197 4.2052 26.5001C3.89837 26.2806 3.6378 26.0027 3.43836 25.6824C3.23891 25.3621 3.10451 25.0057 3.04282 24.6334C2.98113 24.2612 2.99336 23.8805 3.07881 23.513C3.16426 23.1455 3.32126 22.7984 3.54085 22.4916C3.76043 22.1847 4.0383 21.9242 4.35859 21.7247L8.29603 19.2737C8.5131 19.1392 8.69222 18.9515 8.81644 18.7284C8.94065 18.5053 9.00585 18.2541 9.00585 17.9988C9.00585 17.7434 8.94065 17.4923 8.81644 17.2691C8.69222 17.046 8.5131 16.8583 8.29603 16.7238L4.35859 14.2743C3.71174 13.8715 3.25139 13.2283 3.07881 12.4861C2.90623 11.7438 3.03556 10.9635 3.43836 10.3166C3.84115 9.66978 4.4844 9.20942 5.22661 9.03685C5.96883 8.86427 6.74919 8.9936 7.39605 9.39639L10.4845 11.3194C10.7113 11.4604 10.9716 11.5383 11.2386 11.545C11.5055 11.5518 11.7694 11.4871 12.0031 11.3578C12.2367 11.2284 12.4315 11.0391 12.5675 10.8092C12.7035 10.5794 12.7756 10.3174 12.7765 10.0504V6.16094C12.7603 5.43067 13.0014 4.71798 13.4577 4.14759C13.914 3.57721 14.5564 3.18549 15.2724 3.04099C15.703 2.9676 16.1444 2.98913 16.5658 3.10407C16.9872 3.21901 17.3785 3.42459 17.7122 3.70643C18.0459 3.98827 18.314 4.33959 18.4978 4.73582C18.6816 5.13205 18.7767 5.56365 18.7764 6.00044V10.0504C18.7767 10.3177 18.8485 10.58 18.9842 10.8103C19.12 11.0405 19.3148 11.2304 19.5485 11.3601C19.7822 11.4898 20.0463 11.5547 20.3135 11.548C20.5808 11.5414 20.8413 11.4635 21.0683 11.3224L24.1568 9.40089C24.4771 9.20145 24.8335 9.06705 25.2058 9.00535C25.578 8.94366 25.9587 8.95589 26.3262 9.04135C26.6937 9.1268 27.0408 9.2838 27.3476 9.50338C27.6545 9.72297 27.915 10.0008 28.1145 10.3211C28.3139 10.6414 28.4483 10.9979 28.51 11.3701C28.5717 11.7423 28.5595 12.1231 28.474 12.4906C28.3886 12.8581 28.2316 13.2051 28.012 13.512C27.7924 13.8188 27.5145 14.0794 27.1943 14.2788L23.2568 16.7298C23.0398 16.8643 22.8606 17.052 22.7364 17.2751C22.6122 17.4983 22.547 17.7494 22.547 18.0048C22.547 18.2601 22.6122 18.5113 22.7364 18.7344C22.8606 18.9575 23.0398 19.1452 23.2568 19.2797L27.1943 21.7307C27.5147 21.9299 27.7928 22.1903 28.0126 22.497C28.2323 22.8037 28.3895 23.1508 28.475 23.5183C28.5605 23.8858 28.5728 24.2665 28.5111 24.6388C28.4493 25.011 28.3148 25.3674 28.1152 25.6877V25.6772Z" />
            </svg>
          )}
        />
      )}
    </div>
  );
};

export default function GamePage<RuntimeModules extends RuntimeModulesRecord>({
  children,
  gameConfig,
  image = '/image/game-page/game-title-template.svg',
  mobileImage = '/image/game-page/game-title-mobile-template.svg',
  defaultPage,
  customDesign = false,
}: {
  children: ReactNode;
  gameConfig: ZkNoidGameConfig<RuntimeModules>;
  image: any;
  mobileImage: any;
  defaultPage: 'Competitions List' | 'Game' | 'New Competition' | 'Lobby list';
  customDesign?: boolean;
}) {
  return (
    <>
      <Header />

      <div className={'flex flex-col px-5'}>
        {!customDesign ? (
          <>
            <div
              className={
                'mb-12 w-full rounded-[10px] border border-left-accent lg:rounded-[20px] lg:border-2'
              }
            >
              <Image
                src={image}
                alt={'Game'}
                width={1500}
                height={30}
                className={
                  'hidden w-full rounded-[10px] object-contain object-center lg:block'
                }
              />
              <Image
                src={mobileImage}
                alt={'Game'}
                width={1500}
                height={30}
                className={
                  'block w-full rounded-[10px] object-contain object-center lg:hidden'
                }
              />
            </div>
            <WidgetsSwitch
              competitionsSupported={!!gameConfig.pageCompetitionsList}
              lobbiesSupported={!!gameConfig.lobby}
              defaultPage={defaultPage}
              gameId={gameConfig.id}
              gameName={gameConfig.name}
            />
            <div
              className={
                'relative flex w-full flex-col gap-20 rounded-b-[10px] border-x border-b border-left-accent p-4 lg:rounded-2xl lg:border-2 lg:p-10 '
              }
            >
              <div
                className={
                  'absolute left-0 top-0 -z-10 h-[200px] w-full bg-bg-dark'
                }
              />
              {children}
            </div>
          </>
        ) : (
          <div className={'flex flex-col px-5'}>{children}</div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
