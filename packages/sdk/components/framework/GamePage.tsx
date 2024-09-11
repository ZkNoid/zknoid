import { ReactNode } from "react";
import Image from "next/image";
import gameTitleTemplate from "../../public/image/game-page/game-title-template.svg";
import Link from "next/link";
import { cn } from "../../lib/helpers";
import { usePathname, useSearchParams } from "next/navigation";
import { ZkNoidGameConfig } from "../../lib/createConfig";
import { usePollMinaBlockHeight } from "../../lib/stores/minaChain";
import { usePollProtokitBlockHeight } from "../../lib/stores/protokitChain";
import { useObserveMinaBalance } from "../../lib/stores/minaBalances";
import type { RuntimeModulesRecord } from "@proto-kit/module";

export function TabsSwitch({
  gameName,
  gameId,
  competitionsSupported,
  lobbiesSupported,
  tabs,
}: {
  gameName: string;
  gameId: string;
  competitionsSupported: boolean;
  lobbiesSupported: boolean;
  tabs?: { name: string; tab: string; icon?: ReactNode }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  return (
    <div className={"absolute -left-[2px] -top-[4vw] flex w-fit flex-row"}>
      <div className={"relative w-[20vw]"} key={"gameTab"}>
        <svg
          width="307"
          height="191"
          viewBox="0 0 307 191"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={"absolute left-0 top-0 -z-[1] h-fit w-[20vw]"}
        >
          <path
            d="M1 31.5859V111.086V159.086C1 175.654 14.4315 189.086 31 189.086H276C292.569 189.086 306 175.654 306 159.086V63.5123C306 55.5559 302.839 47.9252 297.213 42.2991L265.287 10.3727C259.661 4.74664 252.03 1.58594 244.074 1.58594H31C14.4315 1.58594 1 15.0174 1 31.5859Z"
            fill="#252525"
            stroke="#D2FF00"
            stroke-width="2"
          />
        </svg>
        <Link
          href={`/games/${gameId}/undefined`}
          className={cn(
            "absolute top-0 flex h-[4vw] w-[18vw] cursor-pointer flex-row items-center justify-center gap-[0.781vw] hover:opacity-80",
            !tabs && !competitionsSupported && !lobbiesSupported
              ? "left-0"
              : "-left-[1vw]",
          )}
        >
          <svg
            width="33"
            height="25"
            viewBox="0 0 33 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={"mb-[0.313vw] h-[1.5vw] w-[1.5vw]"}
          >
            <path
              d="M22.9073 10.4041H19.6346C19.3452 10.4041 19.0677 10.2892 18.8632 10.0846C18.6586 9.88001 18.5436 9.60254 18.5436 9.31321C18.5436 9.02388 18.6586 8.74641 18.8632 8.54182C19.0677 8.33724 19.3452 8.2223 19.6346 8.2223H22.9073C23.1966 8.2223 23.4741 8.33724 23.6787 8.54182C23.8833 8.74641 23.9982 9.02388 23.9982 9.31321C23.9982 9.60254 23.8833 9.88001 23.6787 10.0846C23.4741 10.2892 23.1966 10.4041 22.9073 10.4041ZM13.0891 8.2223H11.9982V7.13139C11.9982 6.84207 11.8833 6.56459 11.6787 6.36C11.4741 6.15542 11.1966 6.04048 10.9073 6.04048C10.6179 6.04048 10.3405 6.15542 10.1359 6.36C9.9313 6.56459 9.81637 6.84207 9.81637 7.13139V8.2223H8.72546C8.43613 8.2223 8.15865 8.33724 7.95407 8.54182C7.74948 8.74641 7.63455 9.02388 7.63455 9.31321C7.63455 9.60254 7.74948 9.88001 7.95407 10.0846C8.15865 10.2892 8.43613 10.4041 8.72546 10.4041H9.81637V11.495C9.81637 11.7844 9.9313 12.0618 10.1359 12.2664C10.3405 12.471 10.6179 12.5859 10.9073 12.5859C11.1966 12.5859 11.4741 12.471 11.6787 12.2664C11.8833 12.0618 11.9982 11.7844 11.9982 11.495V10.4041H13.0891C13.3784 10.4041 13.6559 10.2892 13.8605 10.0846C14.0651 9.88001 14.18 9.60254 14.18 9.31321C14.18 9.02388 14.0651 8.74641 13.8605 8.54182C13.6559 8.33724 13.3784 8.2223 13.0891 8.2223ZM31.8364 22.4928C31.4252 23.0799 30.8905 23.5698 30.2698 23.9282C29.6491 24.2866 28.9574 24.5047 28.2434 24.5672C27.5293 24.6297 26.8103 24.5351 26.1367 24.2901C25.4632 24.045 24.8515 23.6554 24.3445 23.1487C24.3282 23.1323 24.3118 23.1159 24.2968 23.0982L18.8818 16.9496H13.8364L8.42682 23.0982L8.37909 23.1487C7.45755 24.0682 6.20912 24.585 4.90728 24.5859C4.1906 24.5857 3.48267 24.4285 2.83323 24.1254C2.18378 23.8224 1.60856 23.3808 1.14798 22.8317C0.687406 22.2826 0.352636 21.6394 0.167192 20.9471C-0.018253 20.2548 -0.0498746 19.5304 0.0745483 18.8246C0.0738914 18.8182 0.0738914 18.8118 0.0745483 18.8055L2.30682 7.33866C2.63904 5.44739 3.62717 3.73371 5.09758 2.49873C6.56799 1.26375 8.42659 0.586482 10.3468 0.585938H22.3618C24.2763 0.588992 26.1292 1.26238 27.5989 2.4892C29.0685 3.71601 30.0622 5.41877 30.4073 7.30185V7.32639L32.6395 18.8041C32.6402 18.8105 32.6402 18.8169 32.6395 18.8232C32.7551 19.4576 32.7436 20.1086 32.6057 20.7385C32.4678 21.3684 32.2063 21.9646 31.8364 22.4928ZM22.3618 14.7678C23.9531 14.7678 25.4792 14.1356 26.6045 13.0104C27.7297 11.8852 28.3618 10.3591 28.3618 8.76776C28.3618 7.17646 27.7297 5.65033 26.6045 4.52511C25.4792 3.3999 23.9531 2.76776 22.3618 2.76776H10.3468C8.93812 2.76902 7.57499 3.26703 6.49724 4.17417C5.41949 5.08132 4.69618 6.33948 4.45455 7.7273V7.74503L2.22091 19.2118C2.12218 19.7803 2.2063 20.3655 2.46115 20.8831C2.71601 21.4008 3.12849 21.8243 3.63925 22.0927C4.15001 22.3611 4.73275 22.4606 5.30364 22.3769C5.87453 22.2932 6.40417 22.0306 6.81637 21.6268L12.5327 15.1373C12.6351 15.0212 12.761 14.9282 12.902 14.8645C13.0431 14.8007 13.1961 14.7678 13.3509 14.7678H22.3618ZM30.5027 19.2118L29.3109 13.0755C28.5779 14.2591 27.555 15.2361 26.339 15.9141C25.1229 16.592 23.754 16.9484 22.3618 16.9496H21.7891L25.9073 21.6282C26.2178 21.9302 26.5955 22.1543 27.0093 22.2821C27.4232 22.4098 27.8615 22.4376 28.2882 22.3632C28.999 22.2377 29.6311 21.8356 30.046 21.2449C30.4608 20.6542 30.6246 19.9231 30.5014 19.2118H30.5027Z"
              fill="#D2FF00"
              className={cn(
                !currentTab &&
                  !pathname.includes("lobby") &&
                  !pathname.includes("competitions-list")
                  ? "fill-left-accent"
                  : "fill-foreground",
              )}
            />
          </svg>
          <span
            className={cn(
              "font-museo text-[1.25vw] font-medium",
              !currentTab &&
                !pathname.includes("lobby") &&
                !pathname.includes("competitions-list")
                ? "text-left-accent"
                : "text-foreground",
            )}
          >
            {gameName}
          </span>
        </Link>
      </div>
      {competitionsSupported && (
        <div
          className={"relative w-[20vw] first:ml-0 -ml-[4.167vw]"}
          key={"gameTabCompetitions"}
        >
          <svg
            width="307"
            height="191"
            viewBox="0 0 307 191"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={"absolute left-0 top-0 -z-[1] h-fit w-[20vw]"}
          >
            <path
              d="M1 31.5859V111.086V159.086C1 175.654 14.4315 189.086 31 189.086H276C292.569 189.086 306 175.654 306 159.086V63.5123C306 55.5559 302.839 47.9252 297.213 42.2991L265.287 10.3727C259.661 4.74664 252.03 1.58594 244.074 1.58594H31C14.4315 1.58594 1 15.0174 1 31.5859Z"
              fill="#252525"
              stroke="#D2FF00"
              stroke-width="2"
            />
          </svg>
          <Link
            href={`/games/${gameId}/competitions-list`}
            className={cn(
              "absolute top-0 flex h-[4vw] w-[18vw] cursor-pointer flex-row items-center justify-center gap-[0.781vw] hover:opacity-80",
              !tabs ? "left-0" : "-left-[1vw]",
            )}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={"mb-[0.313vw] h-[1.5vw] w-[1.5vw]"}
            >
              <g clip-path="url(#clip0_6759_63686)">
                <path
                  d="M15 8.99999H34.5C34.8978 8.99999 35.2794 8.84196 35.5607 8.56066C35.842 8.27935 36 7.89782 36 7.5C36 7.10217 35.842 6.72064 35.5607 6.43934C35.2794 6.15804 34.8978 6 34.5 6H15C14.6022 6 14.2206 6.15804 13.9393 6.43934C13.658 6.72064 13.5 7.10217 13.5 7.5C13.5 7.89782 13.658 8.27935 13.9393 8.56066C14.2206 8.84196 14.6022 8.99999 15 8.99999Z"
                  fill="#D2FF00"
                  className={cn(
                    pathname.includes("competitions-list")
                      ? "fill-left-accent"
                      : "fill-foreground",
                  )}
                />
                <path
                  d="M34.5 16.5H15C14.6022 16.5 14.2206 16.658 13.9393 16.9393C13.658 17.2206 13.5 17.6022 13.5 18C13.5 18.3978 13.658 18.7794 13.9393 19.0607C14.2206 19.342 14.6022 19.5 15 19.5H34.5C34.8978 19.5 35.2794 19.342 35.5607 19.0607C35.842 18.7794 36 18.3978 36 18C36 17.6022 35.842 17.2206 35.5607 16.9393C35.2794 16.658 34.8978 16.5 34.5 16.5Z"
                  fill="#D2FF00"
                  className={cn(
                    pathname.includes("competitions-list")
                      ? "fill-left-accent"
                      : "fill-foreground",
                  )}
                />
                <path
                  d="M34.5 27H15C14.6022 27 14.2206 27.158 13.9393 27.4393C13.658 27.7206 13.5 28.1022 13.5 28.5C13.5 28.8978 13.658 29.2794 13.9393 29.5607C14.2206 29.842 14.6022 30 15 30H34.5C34.8978 30 35.2794 29.842 35.5607 29.5607C35.842 29.2794 36 28.8978 36 28.5C36 28.1022 35.842 27.7206 35.5607 27.4393C35.2794 27.158 34.8978 27 34.5 27Z"
                  fill="#D2FF00"
                  className={cn(
                    pathname.includes("competitions-list")
                      ? "fill-left-accent"
                      : "fill-foreground",
                  )}
                />
                <path
                  d="M9.12989 9.00075C9.27829 9.00072 9.42335 8.95666 9.5467 8.87415C9.67006 8.79165 9.76616 8.6744 9.82285 8.53725C9.87954 8.4001 9.89427 8.24922 9.86517 8.1037C9.83607 7.95817 9.76446 7.82455 9.65939 7.71975L5.99939 4.06125C5.7181 3.78004 5.33664 3.62207 4.93889 3.62207C4.54114 3.62207 4.15968 3.78004 3.87839 4.06125L0.219889 7.71975C0.11482 7.82455 0.043204 7.95817 0.0141063 8.1037C-0.0149914 8.24922 -0.000263143 8.4001 0.0564271 8.53725C0.113117 8.6744 0.209221 8.79165 0.332574 8.87415C0.455928 8.95666 0.600986 9.00072 0.749389 9.00075H3.44039V27.0008H0.749389C0.600858 27.0005 0.455593 27.0443 0.332009 27.1267C0.208425 27.2091 0.112089 27.3263 0.0552126 27.4636C-0.00166366 27.6008 -0.0165183 27.7518 0.0125319 27.8974C0.041582 28.0431 0.113229 28.1769 0.218389 28.2818L3.87839 31.9403C4.15968 32.2215 4.54114 32.3794 4.93889 32.3794C5.33664 32.3794 5.7181 32.2215 5.99939 31.9403L9.65939 28.2818C9.76446 28.1769 9.83607 28.0433 9.86517 27.8978C9.89427 27.7523 9.87954 27.6014 9.82285 27.4643C9.76616 27.3271 9.67006 27.2099 9.5467 27.1273C9.42335 27.0448 9.27829 27.0008 9.12989 27.0008H6.44039V9.00075H9.12989Z"
                  fill="#D2FF00"
                  className={cn(
                    pathname.includes("competitions-list")
                      ? "fill-left-accent"
                      : "fill-foreground",
                  )}
                />
              </g>
              <defs>
                <clipPath id="clip0_6759_63686">
                  <rect width="36" height="36" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span
              className={cn(
                "font-museo text-[1.25vw] font-medium",
                pathname.includes("competitions-list")
                  ? "text-left-accent"
                  : "text-foreground",
              )}
            >
              Competitions list
            </span>
          </Link>
        </div>
      )}
      {lobbiesSupported && (
        <div
          className={"relative w-[20vw] first:ml-0 -ml-[4.167vw]"}
          key={"gameTabLobby"}
        >
          <svg
            width="307"
            height="191"
            viewBox="0 0 307 191"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={"absolute left-0 top-0 -z-[1] h-fit w-[20vw]"}
          >
            <path
              d="M1 31.5859V111.086V159.086C1 175.654 14.4315 189.086 31 189.086H276C292.569 189.086 306 175.654 306 159.086V63.5123C306 55.5559 302.839 47.9252 297.213 42.2991L265.287 10.3727C259.661 4.74664 252.03 1.58594 244.074 1.58594H31C14.4315 1.58594 1 15.0174 1 31.5859Z"
              fill="#252525"
              stroke="#D2FF00"
              stroke-width="2"
            />
          </svg>
          <Link
            href={`/games/${gameId}/lobby/undefined`}
            className={cn(
              "absolute top-0 flex h-[4vw] w-[18vw] cursor-pointer flex-row items-center justify-center gap-[0.781vw] hover:opacity-80",
              !tabs ? "left-0" : "-left-[1vw]",
            )}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={"mb-[0.313vw] h-[1.5vw] w-[1.5vw]"}
            >
              <g clip-path="url(#clip0_6759_63686)">
                <path
                  d="M15 8.99999H34.5C34.8978 8.99999 35.2794 8.84196 35.5607 8.56066C35.842 8.27935 36 7.89782 36 7.5C36 7.10217 35.842 6.72064 35.5607 6.43934C35.2794 6.15804 34.8978 6 34.5 6H15C14.6022 6 14.2206 6.15804 13.9393 6.43934C13.658 6.72064 13.5 7.10217 13.5 7.5C13.5 7.89782 13.658 8.27935 13.9393 8.56066C14.2206 8.84196 14.6022 8.99999 15 8.99999Z"
                  fill="#D2FF00"
                  className={cn(
                    pathname.includes("lobby")
                      ? "fill-left-accent"
                      : "fill-foreground",
                  )}
                />
                <path
                  d="M34.5 16.5H15C14.6022 16.5 14.2206 16.658 13.9393 16.9393C13.658 17.2206 13.5 17.6022 13.5 18C13.5 18.3978 13.658 18.7794 13.9393 19.0607C14.2206 19.342 14.6022 19.5 15 19.5H34.5C34.8978 19.5 35.2794 19.342 35.5607 19.0607C35.842 18.7794 36 18.3978 36 18C36 17.6022 35.842 17.2206 35.5607 16.9393C35.2794 16.658 34.8978 16.5 34.5 16.5Z"
                  fill="#D2FF00"
                  className={cn(
                    pathname.includes("lobby")
                      ? "fill-left-accent"
                      : "fill-foreground",
                  )}
                />
                <path
                  d="M34.5 27H15C14.6022 27 14.2206 27.158 13.9393 27.4393C13.658 27.7206 13.5 28.1022 13.5 28.5C13.5 28.8978 13.658 29.2794 13.9393 29.5607C14.2206 29.842 14.6022 30 15 30H34.5C34.8978 30 35.2794 29.842 35.5607 29.5607C35.842 29.2794 36 28.8978 36 28.5C36 28.1022 35.842 27.7206 35.5607 27.4393C35.2794 27.158 34.8978 27 34.5 27Z"
                  fill="#D2FF00"
                  className={cn(
                    pathname.includes("lobby")
                      ? "fill-left-accent"
                      : "fill-foreground",
                  )}
                />
                <path
                  d="M9.12989 9.00075C9.27829 9.00072 9.42335 8.95666 9.5467 8.87415C9.67006 8.79165 9.76616 8.6744 9.82285 8.53725C9.87954 8.4001 9.89427 8.24922 9.86517 8.1037C9.83607 7.95817 9.76446 7.82455 9.65939 7.71975L5.99939 4.06125C5.7181 3.78004 5.33664 3.62207 4.93889 3.62207C4.54114 3.62207 4.15968 3.78004 3.87839 4.06125L0.219889 7.71975C0.11482 7.82455 0.043204 7.95817 0.0141063 8.1037C-0.0149914 8.24922 -0.000263143 8.4001 0.0564271 8.53725C0.113117 8.6744 0.209221 8.79165 0.332574 8.87415C0.455928 8.95666 0.600986 9.00072 0.749389 9.00075H3.44039V27.0008H0.749389C0.600858 27.0005 0.455593 27.0443 0.332009 27.1267C0.208425 27.2091 0.112089 27.3263 0.0552126 27.4636C-0.00166366 27.6008 -0.0165183 27.7518 0.0125319 27.8974C0.041582 28.0431 0.113229 28.1769 0.218389 28.2818L3.87839 31.9403C4.15968 32.2215 4.54114 32.3794 4.93889 32.3794C5.33664 32.3794 5.7181 32.2215 5.99939 31.9403L9.65939 28.2818C9.76446 28.1769 9.83607 28.0433 9.86517 27.8978C9.89427 27.7523 9.87954 27.6014 9.82285 27.4643C9.76616 27.3271 9.67006 27.2099 9.5467 27.1273C9.42335 27.0448 9.27829 27.0008 9.12989 27.0008H6.44039V9.00075H9.12989Z"
                  fill="#D2FF00"
                  className={cn(
                    pathname.includes("lobby")
                      ? "fill-left-accent"
                      : "fill-foreground",
                  )}
                />
              </g>
              <defs>
                <clipPath id="clip0_6759_63686">
                  <rect width="36" height="36" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span
              className={cn(
                "font-museo text-[1.25vw] font-medium",
                pathname.includes("lobby")
                  ? "text-left-accent"
                  : "text-foreground",
              )}
            >
              Lobby list
            </span>
          </Link>
        </div>
      )}
      {tabs &&
        tabs.map((tab, index) => (
          <div
            className={"relative w-[20vw] first:ml-0 -ml-[4.167vw]"}
            key={index}
          >
            <svg
              width="307"
              height="191"
              viewBox="0 0 307 191"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={"absolute left-0 top-0 -z-[1] h-fit w-[20vw]"}
            >
              <path
                d="M1 31.5859V111.086V159.086C1 175.654 14.4315 189.086 31 189.086H276C292.569 189.086 306 175.654 306 159.086V63.5123C306 55.5559 302.839 47.9252 297.213 42.2991L265.287 10.3727C259.661 4.74664 252.03 1.58594 244.074 1.58594H31C14.4315 1.58594 1 15.0174 1 31.5859Z"
                fill="#252525"
                stroke="#D2FF00"
                stroke-width="2"
              />
            </svg>
            <Link
              href={`/games/${gameId}/undefined?tab=${tab.tab}`}
              className={cn(
                "absolute  top-0 flex h-[4vw] w-[18vw] cursor-pointer flex-row items-center justify-center gap-[0.781vw] hover:opacity-80",
                tabs.length == index + 1 ? "left-0" : "-left-[1vw]",
              )}
            >
              {tab.icon && (
                <div className={"mb-[0.313vw] h-[1.5vw] w-[1.5vw]"}>
                  {tab.icon}
                </div>
              )}

              <span
                className={cn(
                  "font-museo text-[1.25vw] font-medium",
                  currentTab == tab.tab
                    ? "text-left-accent"
                    : "text-foreground",
                )}
              >
                {tab.name}
              </span>
            </Link>
          </div>
        ))}
    </div>
  );
}

const Updater = () => {
  usePollMinaBlockHeight();
  usePollProtokitBlockHeight();
  useObserveMinaBalance();

  return <></>;
};

export default function GamePage<RuntimeModules extends RuntimeModulesRecord>({
  children,
  gameConfig,
  useTitle = true,
  gameTitleImage = gameTitleTemplate,
  customGameTitle,
  useTabs = true,
  tabs,
  useLayout = true,
}: {
  children: ReactNode;
  gameConfig: ZkNoidGameConfig<RuntimeModules>;
  useTitle?: boolean;
  gameTitleImage?: any;
  customGameTitle?: ReactNode;
  useTabs?: boolean;
  tabs?: { name: string; tab: string; icon?: ReactNode }[];
  useLayout?: boolean;
}) {
  return (
    <div className={"px-[2.604vw]"}>
      {useTitle &&
        (customGameTitle ? (
          customGameTitle
        ) : (
          <div
            className={cn(
              "w-full border-2 rounded-[1.042vw] border-left-accent h-[15.625vw] overflow-hidden",
              useTabs ? "mb-[7.813vw]" : "mb-[5.208vw]",
            )}
          >
            <Image
              src={gameTitleImage}
              alt={"gameImage"}
              className={
                "w-full h-full object-center object-cover rounded-[0.781vw]"
              }
            />
          </div>
        ))}
      {useLayout ? (
        <div
          className={
            "relative mt-[3.646vw] h-full w-full rounded-[2.604vw] border-2 border-left-accent bg-bg-grey p-[2.083vw]"
          }
        >
          {useTabs && (
            <TabsSwitch
              gameName={gameConfig.name}
              gameId={gameConfig.id}
              competitionsSupported={!!gameConfig.pageCompetitionsList}
              lobbiesSupported={!!gameConfig.lobby}
              tabs={tabs}
            />
          )}
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
      <Updater />
    </div>
  );
}
