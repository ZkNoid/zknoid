import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { IGame } from '@/app/constants/games';
import { FavoriteGames } from '@/components/ui/games-store/widgets/FavoriteGames';
import { GameStore } from '@/components/ui/games-store/widgets/GameStore/GameStore';
import { SOCIALS } from '@/constants/socials';
import { SupportAndFaq } from '@/components/ui/games-store/widgets/SupportAndFaq';
import centralBlockImg from '@/public/image/central-block.svg';
import webImg from '@/public/image/misc/web.svg';
import supportImg from '@/public/image/misc/support.svg';
import { clsx } from 'clsx';

enum Pages {
  GameStore = 'GameStore',
  FavoriteGames = 'FavoriteGames',
  Support = 'Support',
}

export const Section2 = ({ games }: { games: IGame[] }) => {
  const [page, setPage] = useState<Pages>(Pages.GameStore);

  const CentralBlock = () => (
    <div className="relative hidden w-[50%] self-end text-[24px] lg:flex">
      <Image
        alt="central block"
        src={centralBlockImg}
        className="w-full"
      ></Image>
      <div className="absolute flex h-full w-full items-center justify-around">
        <div
          className={clsx(
            'flex gap-2 text-headline-3 text-left-accent hover:opacity-80',
            { underline: page === Pages.Support }
          )}
          onClick={() => setPage(Pages.Support)}
        >
          <Image src={supportImg} alt={'Headphones'} />
          <span className={'cursor-pointer'}>FAQ & Support</span>
        </div>
        <Link
          href={'https://zknoid.io'}
          className="flex gap-2 text-headline-3 text-left-accent hover:opacity-80"
        >
          <Image src={webImg} alt="Web" />
          About us
        </Link>
        <div className="flex gap-3">
          {SOCIALS.map((x) => (
            <Link href={x.link} key={x.id} className={'hover:opacity-80'}>
              <Image alt={x.name} src={x.image} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  const MobileCentralBlock = () => {
    return (
      <div
        className={
          'my-12 flex w-full items-center justify-center gap-4 rounded-[10px] border border-left-accent px-2 py-4 lg:hidden'
        }
      >
        {SOCIALS.map((x) => (
          <Link href={x.link} key={x.id} className={'hover:opacity-80'}>
            <Image alt={x.name} src={x.image} />
          </Link>
        ))}
      </div>
    );
  };

  const SwitchBtn = ({
    switchPage,
    children,
  }: {
    switchPage: Pages;
    children: ReactNode;
  }) => {
    return (
      <div
        className={`group relative flex w-full flex-row items-center justify-start gap-2 rounded-t-[10px] border-x border-t border-left-accent py-2 pl-4 first:-mb-2 first:pb-4 lg:rounded-none lg:border-none ${
          page === switchPage ? 'text-left-accent' : ''
        }`}
        data-iscurrentpage={page === switchPage}
      >
        {children}
        <button
          onClick={() => setPage(switchPage)}
          className={'text-headline-3 group-hover:opacity-80'}
        >
          {switchPage}
        </button>
        <div className={'absolute -left-5 -top-5 -z-20 hidden lg:block'}>
          <svg
            width="380"
            height="190"
            viewBox="0 0 380 190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 31V110.5V158.5C1 175.069 14.4315 188.5 31 188.5H348.5C365.069 188.5 378.5 175.069 378.5 158.5V62.9264C378.5 54.9699 375.339 47.3393 369.713 41.7132L337.787 9.7868C332.161 4.16071 324.53 1 316.574 1H31C14.4315 1 1 14.4315 1 31Z"
              fill="#212121"
              stroke="#D2FF00"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  };

  const WidgetsSwitch = () => {
    return (
      <div
        className={
          'flex flex-col items-center justify-start lg:ml-5 lg:mt-20 lg:flex-row lg:gap-14 lg:max-[2000px]:pb-4'
        }
      >
        <SwitchBtn switchPage={Pages.GameStore}>
          <svg
            width="40"
            height="29"
            viewBox="0 0 33 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.9073 9.81818H19.6346C19.3452 9.81818 19.0677 9.70325 18.8632 9.49866C18.6586 9.29408 18.5436 9.0166 18.5436 8.72727C18.5436 8.43795 18.6586 8.16047 18.8632 7.95588C19.0677 7.7513 19.3452 7.63636 19.6346 7.63636H22.9073C23.1966 7.63636 23.4741 7.7513 23.6787 7.95588C23.8833 8.16047 23.9982 8.43795 23.9982 8.72727C23.9982 9.0166 23.8833 9.29408 23.6787 9.49866C23.4741 9.70325 23.1966 9.81818 22.9073 9.81818ZM13.0891 7.63636H11.9982V6.54545C11.9982 6.25613 11.8833 5.97865 11.6787 5.77407C11.4741 5.56948 11.1966 5.45455 10.9073 5.45455C10.6179 5.45455 10.3405 5.56948 10.1359 5.77407C9.9313 5.97865 9.81637 6.25613 9.81637 6.54545V7.63636H8.72546C8.43613 7.63636 8.15865 7.7513 7.95407 7.95588C7.74948 8.16047 7.63455 8.43795 7.63455 8.72727C7.63455 9.0166 7.74948 9.29408 7.95407 9.49866C8.15865 9.70325 8.43613 9.81818 8.72546 9.81818H9.81637V10.9091C9.81637 11.1984 9.9313 11.4759 10.1359 11.6805C10.3405 11.8851 10.6179 12 10.9073 12C11.1966 12 11.4741 11.8851 11.6787 11.6805C11.8833 11.4759 11.9982 11.1984 11.9982 10.9091V9.81818H13.0891C13.3784 9.81818 13.6559 9.70325 13.8605 9.49866C14.0651 9.29408 14.18 9.0166 14.18 8.72727C14.18 8.43795 14.0651 8.16047 13.8605 7.95588C13.6559 7.7513 13.3784 7.63636 13.0891 7.63636ZM31.8364 21.9068C31.4252 22.4939 30.8905 22.9839 30.2698 23.3423C29.6491 23.7006 28.9574 23.9188 28.2434 23.9813C27.5293 24.0438 26.8103 23.9492 26.1367 23.7041C25.4632 23.4591 24.8515 23.0695 24.3445 22.5627C24.3282 22.5464 24.3118 22.53 24.2968 22.5123L18.8818 16.3636H13.8364L8.42682 22.5123L8.37909 22.5627C7.45755 23.4823 6.20912 23.9991 4.90728 24C4.1906 23.9997 3.48267 23.8426 2.83323 23.5395C2.18378 23.2364 1.60856 22.7949 1.14798 22.2458C0.687406 21.6967 0.352636 21.0534 0.167192 20.3612C-0.018253 19.6689 -0.0498746 18.9444 0.0745483 18.2386C0.0738914 18.2323 0.0738914 18.2259 0.0745483 18.2195L2.30682 6.75273C2.63904 4.86146 3.62717 3.14777 5.09758 1.91279C6.56799 0.67781 8.42659 0.000544698 10.3468 0H22.3618C24.2763 0.00305414 26.1292 0.676446 27.5989 1.90326C29.0685 3.13007 30.0622 4.83284 30.4073 6.71591V6.74045L32.6395 18.2182C32.6402 18.2245 32.6402 18.2309 32.6395 18.2373C32.7551 18.8716 32.7436 19.5226 32.6057 20.1525C32.4678 20.7824 32.2063 21.3787 31.8364 21.9068ZM22.3618 14.1818C23.9531 14.1818 25.4792 13.5497 26.6045 12.4245C27.7297 11.2992 28.3618 9.77312 28.3618 8.18182C28.3618 6.59052 27.7297 5.0644 26.6045 3.93918C25.4792 2.81396 23.9531 2.18182 22.3618 2.18182H10.3468C8.93812 2.18308 7.57499 2.68109 6.49724 3.58824C5.41949 4.49538 4.69618 5.75354 4.45455 7.14136V7.15909L2.22091 18.6259C2.12218 19.1944 2.2063 19.7796 2.46115 20.2972C2.71601 20.8149 3.12849 21.2384 3.63925 21.5068C4.15001 21.7752 4.73275 21.8747 5.30364 21.791C5.87453 21.7073 6.40417 21.4447 6.81637 21.0409L12.5327 14.5514C12.6351 14.4352 12.761 14.3422 12.902 14.2785C13.0431 14.2148 13.1961 14.1818 13.3509 14.1818H22.3618ZM30.5027 18.6259L29.3109 12.4895C28.5779 13.6732 27.555 14.6502 26.339 15.3281C25.1229 16.0061 23.754 16.3625 22.3618 16.3636H21.7891L25.9073 21.0423C26.2178 21.3443 26.5955 21.5684 27.0093 21.6961C27.4232 21.8239 27.8615 21.8517 28.2882 21.7773C28.999 21.6518 29.6311 21.2496 30.046 20.6589C30.4608 20.0682 30.6246 19.3371 30.5014 18.6259H30.5027Z"
              fill="#F9F8F4"
              className={
                'group-hover:opacity-80 group-data-[iscurrentpage=true]:fill-left-accent'
              }
            />
          </svg>
        </SwitchBtn>
        <SwitchBtn switchPage={Pages.FavoriteGames}>
          <svg
            width="32"
            height="29"
            viewBox="0 0 24 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.12 18.66L12 18.78L11.868 18.66C6.168 13.488 2.4 10.068 2.4 6.6C2.4 4.2 4.2 2.4 6.6 2.4C8.448 2.4 10.248 3.6 10.884 5.232H13.116C13.752 3.6 15.552 2.4 17.4 2.4C19.8 2.4 21.6 4.2 21.6 6.6C21.6 10.068 17.832 13.488 12.12 18.66ZM17.4 0C15.312 0 13.308 0.972 12 2.496C10.692 0.972 8.688 0 6.6 0C2.904 0 0 2.892 0 6.6C0 11.124 4.08 14.832 10.26 20.436L12 22.02L13.74 20.436C19.92 14.832 24 11.124 24 6.6C24 2.892 21.096 0 17.4 0Z"
              fill="#F9F8F4"
              className={
                'group-hover:opacity-80 group-data-[iscurrentpage=true]:fill-left-accent'
              }
            />
          </svg>
        </SwitchBtn>
      </div>
    );
  };

  return (
    <>
      <div className={'flex w-full flex-col justify-between lg:flex-row'}>
        <MobileCentralBlock />
        <WidgetsSwitch />
        <CentralBlock />
      </div>

      <div className="relative flex flex-col rounded-b-[10px] border-x border-b border-left-accent lg:rounded-none lg:border-none">
        <div
          className={
            'absolute left-0.5 top-0 -z-20 hidden h-[200px] w-full bg-bg-dark lg:block'
          }
        />
        <div className="absolute left-0 top-0 -z-10 hidden h-full w-full flex-col lg:flex">
          <svg
            viewBox="0 0 1502 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M1451 2341H51C23.3858 2341 1 2318.37 1 2290.75V107V51C1 23.3857 23.3858 1 51 1H650.474C663.726 1 676.436 6.26099 685.812 15.627L723.596 53.373C732.971 62.739 745.681 68 758.933 68H1451C1478.61 68 1501 90.3857 1501 118V182V2291C1501 2318.61 1478.61 2341 1451 2341Z"
              stroke="#D2FF00"
              strokeWidth="2"
            />
          </svg>
          <div className="flex-grow border-x-[0.160rem] border-left-accent" />
          <svg
            viewBox="0 2142 1502 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M1451 2341H51C23.3858 2341 1 2318.37 1 2290.75V107V51C1 23.3857 23.3858 1 51 1H650.474C663.726 1 676.436 6.26099 685.812 15.627L723.596 53.373C732.971 62.739 745.681 68 758.933 68H1451C1478.61 68 1501 90.3857 1501 118V182V2291C1501 2318.61 1478.61 2341 1451 2341Z"
              stroke="#D2FF00"
              strokeWidth="2"
            />
          </svg>
        </div>

        {page === Pages.GameStore && <GameStore games={games} />}
        {page === Pages.FavoriteGames && <FavoriteGames games={games} />}
        {page === Pages.Support && <SupportAndFaq />}
      </div>
    </>
  );
};
