import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';
import { useEffect, useState } from 'react';
import OwnedTickets from './OwnedTickets';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { AnimatePresence, motion } from 'framer-motion';
import PreviousRounds from '@/games/lottery/ui/TicketsSection/PreviousRounds';
import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';
import { useRoundsStore } from '@/games/lottery/lib/roundsStore';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import noCodesImg from '@/public/image/misc/no-gift-codes.svg';
// import GetMoreTicketsButton from './ui/GetMoreTicketsButton';

interface TicketInfo {
  amount: number;
  numbers: number[];
}

enum VoucherMode {
  Buy,
  BuySuccess,
  List,
  Use,
  UseValid,
  Closed,
}

const BoughtGiftCode = ({ code }: { code: string }) => {
  const notificationStore = useNotificationStore();
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const copyCodes = (giftCode: string | string[]) => {
    const codes = giftCode.toString().replaceAll(',', ', ');
    navigator.clipboard.writeText(codes);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
    notificationStore.create({
      type: 'success',
      message: 'Copied!',
    });
  };

  return (
    <button
      className={
        'flex w-full cursor-pointer flex-row gap-[0.26vw] hover:opacity-80'
      }
      onClick={() => copyCodes(code)}
    >
      <div
        className={
          'w-full rounded-[0.26vw] border border-foreground p-[0.26vw] text-start'
        }
      >
        {code}
      </div>
      <AnimatePresence>
        {linkCopied ? (
          <div
            className={
              'flex items-center justify-center rounded-[0.26vw] border border-foreground p-[0.26vw]'
            }
          >
            <motion.svg
              aria-hidden="true"
              role="presentation"
              viewBox="0 0 17 18"
              className={'h-[1.25vw] w-[1.25vw]'}
            >
              <motion.polyline
                fill="none"
                points="1 9 7 14 15 4"
                stroke="#F9F8F4"
                strokeDasharray="22"
                strokeDashoffset="44"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
              />
            </motion.svg>
          </div>
        ) : (
          <div
            className={
              'flex items-center justify-center rounded-[0.26vw] border border-foreground p-[0.26vw]'
            }
          >
            <svg
              width="14"
              height="17"
              viewBox="0 0 14 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={'h-[1.25vw] w-[1.25vw]'}
            >
              <path
                d="M7.7 14.0965C8.62792 14.0954 9.51751 13.7283 10.1736 13.0757C10.8298 12.4231 11.1989 11.5383 11.2 10.6154V4.51846C11.2011 4.15249 11.1291 3.78995 10.9883 3.45185C10.8475 3.11374 10.6406 2.8068 10.3796 2.54882L8.8102 0.98787C8.55082 0.728297 8.24222 0.522511 7.90229 0.382442C7.56235 0.242372 7.19785 0.170804 6.8299 0.171887H3.5C2.57208 0.172993 1.68249 0.540111 1.02635 1.19272C0.370217 1.84532 0.0011115 2.73012 0 3.65304V10.6154C0.0011115 11.5383 0.370217 12.4231 1.02635 13.0757C1.68249 13.7283 2.57208 14.0954 3.5 14.0965H7.7ZM1.4 10.6154V3.65304C1.4 3.09909 1.62125 2.56782 2.01508 2.17611C2.4089 1.78441 2.94305 1.56435 3.5 1.56435C3.5 1.56435 6.9433 1.5741 7 1.58106V2.95681C7 3.32612 7.1475 3.6803 7.41005 3.94143C7.6726 4.20257 8.0287 4.34928 8.4 4.34928H9.7832C9.7902 4.40567 9.8 10.6154 9.8 10.6154C9.8 11.1693 9.57875 11.7006 9.18492 12.0923C8.7911 12.484 8.25695 12.7041 7.7 12.7041H3.5C2.94305 12.7041 2.4089 12.484 2.01508 12.0923C1.62125 11.7006 1.4 11.1693 1.4 10.6154ZM14 5.74174V13.4003C13.9989 14.3232 13.6298 15.208 12.9736 15.8606C12.3175 16.5132 11.4279 16.8803 10.5 16.8814H4.2C4.01435 16.8814 3.8363 16.8081 3.70503 16.6775C3.57375 16.547 3.5 16.3699 3.5 16.1852C3.5 16.0006 3.57375 15.8235 3.70503 15.6929C3.8363 15.5623 4.01435 15.489 4.2 15.489H10.5C11.057 15.489 11.5911 15.2689 11.9849 14.8772C12.3788 14.4855 12.6 13.9542 12.6 13.4003V5.74174C12.6 5.55709 12.6737 5.38 12.805 5.24943C12.9363 5.11886 13.1143 5.04551 13.3 5.04551C13.4857 5.04551 13.6637 5.11886 13.795 5.24943C13.9263 5.38 14 5.55709 14 5.74174Z"
                fill="#F9F8F4"
              />
            </svg>
          </div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default function TicketsSection() {
  const workerClientStore = useWorkerClientStore();
  const lotteryStore = useWorkerClientStore();
  const roundsStore = useRoundsStore();
  const notificationStore = useNotificationStore();

  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [blankTicket, setBlankTicket] = useState<boolean>(true);
  const [voucherMode, setVoucherMode] = useState<VoucherMode>(
    VoucherMode.Closed
  );
  const [giftCode, setGiftCode] = useState<string>('');
  const [giftCodeToBuyAmount, setGiftCodeToBuyAmount] = useState<number>(1);
  const [boughtGiftCodes, setBoughtGiftCodes] = useState<string[]>([]);
  const [userGiftCodes, setUserGiftCodes] = useState<
    { code: string; used: boolean }[]
  >([]);

  useEffect(() => {
    setTickets([]);
  }, [roundsStore.roundToShowId]);

  useEffect(() => {
    if (tickets.length == 0 && !blankTicket) setBlankTicket(true);
  }, [tickets.length]);

  const renderTickets = blankTicket ? [...tickets, blankTicket] : tickets;

  const validateSchema = Yup.object().shape({
    giftCode: Yup.string().required('This field required'),
    // .test('Check giftCode', 'Code invalid', (testCode) =>
    //     testCode != code ? getCodeQuery.data : true
    // ),
  });

  const submitForm = (giftCode: string) => {
    setGiftCode(giftCode);
    setVoucherMode(VoucherMode.UseValid);
  };

  const copyCodes = (giftCode: string | string[]) => {
    const codes = giftCode.toString().replaceAll(',', ', ');
    navigator.clipboard.writeText(codes);
    notificationStore.create({
      type: 'success',
      message: 'Copied!',
    });
  };

  return (
    <div
      className={cn(
        'relative rounded-[0.67vw] border border-left-accent bg-bg-grey',
        'flex flex-col gap-[2.604vw] px-[2vw] py-[2.67vw]'
      )}
    >
      <div className="">
        <div
          className={cn('grid gap-[2vw]', {
            'grid-cols-2':
              roundsStore.roundToShowId == lotteryStore.lotteryRoundId,
            'grid-cols-1':
              roundsStore.roundToShowId != lotteryStore.lotteryRoundId,
          })}
        >
          <OwnedTickets />
          {roundsStore.roundToShowId == lotteryStore.lotteryRoundId && (
            <div className={'flex flex-col'}>
              <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
              <div className={'flex flex-row gap-[1.33vw]'}>
                <div className={'flex flex-col gap-[0.521vw]'}>
                  {(voucherMode == VoucherMode.Closed ||
                    voucherMode == VoucherMode.Use ||
                    voucherMode == VoucherMode.UseValid) && (
                    <div
                      className={cn({
                        'flex flex-col gap-0':
                          voucherMode != VoucherMode.Closed,
                      })}
                    >
                      <button
                        className={cn(
                          'flex w-[22.5vw] cursor-pointer flex-row items-center justify-center gap-[0.781vw] rounded-[0.521vw] bg-right-accent py-[0.365vw] hover:opacity-80 disabled:cursor-default disabled:hover:opacity-100',
                          {
                            'rounded-b-none': voucherMode != VoucherMode.Closed,
                          }
                        )}
                        onClick={() => setVoucherMode(VoucherMode.Use)}
                        disabled={voucherMode != VoucherMode.Closed}
                      >
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={'my-[0.208vw] h-[1.302vw] w-[1.302vw]'}
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.75 5.99952C6.74993 5.33115 6.95593 4.67901 7.33993 4.13196C7.72393 3.58491 8.26725 3.16955 8.89587 2.94248C9.52449 2.71541 10.2078 2.68768 10.8528 2.86305C11.4977 3.03843 12.0729 3.40839 12.5 3.92252C13.0438 3.26102 13.8267 2.84085 14.6785 2.75335C15.5303 2.66585 16.3823 2.91807 17.0492 3.45521C17.7161 3.99235 18.1441 4.77099 18.2401 5.62191C18.3361 6.47284 18.0924 7.32727 17.562 7.99952H18.5C18.8283 7.99952 19.1534 8.06419 19.4567 8.18982C19.76 8.31546 20.0356 8.49961 20.2678 8.73175C20.4999 8.9639 20.6841 9.2395 20.8097 9.54281C20.9353 9.84613 21 10.1712 21 10.4995V11.7495C21 11.9484 20.921 12.1392 20.7803 12.2799C20.6397 12.4205 20.4489 12.4995 20.25 12.4995H13.55C13.5106 12.4995 13.4716 12.4918 13.4352 12.4767C13.3988 12.4616 13.3657 12.4395 13.3379 12.4117C13.31 12.3838 13.2879 12.3507 13.2728 12.3143C13.2578 12.2779 13.25 12.2389 13.25 12.1995V8.73952C12.9674 8.55836 12.7145 8.33474 12.5 8.07652C12.2855 8.33438 12.0325 8.55767 11.75 8.73852V12.1995C11.75 12.2791 11.7184 12.3554 11.6621 12.4117C11.6059 12.4679 11.5296 12.4995 11.45 12.4995H4.75C4.55109 12.4995 4.36032 12.4205 4.21967 12.2799C4.07902 12.1392 4 11.9484 4 11.7495V10.4995C4 10.1712 4.06466 9.84613 4.1903 9.54281C4.31594 9.2395 4.50009 8.9639 4.73223 8.73175C4.96438 8.49961 5.23998 8.31546 5.54329 8.18982C5.84661 8.06419 6.1717 7.99952 6.5 7.99952H7.438C6.99113 7.42873 6.74885 6.72443 6.75 5.99952ZM11.75 5.99952C11.75 5.53539 11.5656 5.09027 11.2374 4.76208C10.9092 4.4339 10.4641 4.24952 10 4.24952C9.53587 4.24952 9.09075 4.4339 8.76256 4.76208C8.43437 5.09027 8.25 5.53539 8.25 5.99952C8.25 6.46365 8.43437 6.90877 8.76256 7.23696C9.09075 7.56515 9.53587 7.74952 10 7.74952C10.4641 7.74952 10.9092 7.56515 11.2374 7.23696C11.5656 6.90877 11.75 6.46365 11.75 5.99952ZM13.25 5.99952C13.25 6.22933 13.2953 6.4569 13.3832 6.66922C13.4712 6.88154 13.6001 7.07446 13.7626 7.23696C13.9251 7.39946 14.118 7.52836 14.3303 7.61631C14.5426 7.70426 14.7702 7.74952 15 7.74952C15.2298 7.74952 15.4574 7.70426 15.6697 7.61631C15.882 7.52836 16.0749 7.39946 16.2374 7.23696C16.3999 7.07446 16.5288 6.88154 16.6168 6.66922C16.7047 6.4569 16.75 6.22933 16.75 5.99952C16.75 5.53539 16.5656 5.09027 16.2374 4.76208C15.9092 4.4339 15.4641 4.24952 15 4.24952C14.5359 4.24952 14.0908 4.4339 13.7626 4.76208C13.4344 5.09027 13.25 5.53539 13.25 5.99952Z"
                            fill="#252525"
                          />
                          <path
                            d="M11.7516 14.1496C11.7516 14.07 11.72 13.9937 11.6638 13.9375C11.6075 13.8812 11.5312 13.8496 11.4516 13.8496H6.15062C5.95431 13.8498 5.76439 13.9194 5.61437 14.046C5.46434 14.1726 5.36385 14.3481 5.33062 14.5416C5.10854 15.8375 5.10854 17.1617 5.33062 18.4576L5.55462 19.7666C5.62819 20.1955 5.83912 20.589 6.15564 20.8876C6.47216 21.1863 6.87715 21.374 7.30962 21.4226L8.37462 21.5416C9.39488 21.6557 10.4194 21.7274 11.4456 21.7566C11.4855 21.7577 11.5252 21.7507 11.5624 21.7362C11.5995 21.7216 11.6334 21.6997 11.6619 21.6719C11.6904 21.644 11.7131 21.6106 11.7285 21.5738C11.7439 21.537 11.7518 21.4975 11.7516 21.4576V14.1496ZM13.5576 21.7566C13.5177 21.7577 13.478 21.7507 13.4409 21.7362C13.4037 21.7216 13.3699 21.6997 13.3414 21.6719C13.3128 21.644 13.2902 21.6106 13.2748 21.5738C13.2593 21.537 13.2515 21.4975 13.2516 21.4576V14.1496C13.2516 14.07 13.2832 13.9937 13.3395 13.9375C13.3958 13.8812 13.4721 13.8496 13.5516 13.8496H18.8526C19.2586 13.8496 19.6046 14.1416 19.6726 14.5416C19.8956 15.8376 19.8956 17.1616 19.6726 18.4576L19.4496 19.7666C19.376 20.1957 19.1649 20.5892 18.8482 20.8879C18.5315 21.1866 18.1263 21.3742 17.6936 21.4226L16.6286 21.5416C15.6084 21.6556 14.5838 21.7274 13.5576 21.7566Z"
                            fill="#252525"
                          />
                        </svg>
                        <span
                          className={
                            'mt-[0.208vw] font-museo text-[0.833vw] font-medium text-bg-dark'
                          }
                        >
                          Use gift access code
                        </span>
                      </button>
                      {voucherMode == VoucherMode.Use && (
                        <div
                          className={
                            'flex w-[22.5vw] flex-col gap-[0.521vw] rounded-b-[0.521vw] bg-[#252525] p-[0.521vw]'
                          }
                        >
                          <span
                            className={
                              'font-plexsans text-[0.729vw] text-foreground'
                            }
                          >
                            Enter your gift code here
                          </span>
                          <Formik
                            initialValues={{ giftCode: '' }}
                            onSubmit={({ giftCode }) => submitForm(giftCode)}
                            validationSchema={validateSchema}
                          >
                            {({ errors, touched }) => (
                              <Form
                                className={
                                  'flex w-[80%] flex-row items-center justify-start gap-[0.521vw]'
                                }
                              >
                                <div
                                  className={
                                    'flex w-full flex-col gap-[0.521vw]'
                                  }
                                >
                                  <Field
                                    name={'giftCode'}
                                    type={'text'}
                                    className={
                                      'w-full rounded-[0.26vw] border border-foreground bg-[#252525] p-[0.208vw] font-plexsans text-[0.729vw] text-foreground placeholder:opacity-60'
                                    }
                                    placeholder={'Type your gift code...'}
                                  />
                                  <AnimatePresence>
                                    {errors.giftCode && touched.giftCode && (
                                      <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                          type: 'spring',
                                          duration: 0.8,
                                          bounce: 0,
                                        }}
                                        className={
                                          'flex w-full flex-row items-center gap-[0.417vw]'
                                        }
                                      >
                                        <svg
                                          width="18"
                                          height="18"
                                          viewBox="0 0 14 14"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle
                                            cx="7"
                                            cy="7"
                                            r="6"
                                            fill="#FF0000"
                                            stroke="#FF0000"
                                            strokeWidth="0.500035"
                                          />
                                          <path
                                            d="M6.71858 8.69036L6.29858 5.10236V2.71436H7.71458V5.10236L7.31858 8.69036H6.71858ZM7.01858 11.2344C6.71458 11.2344 6.49058 11.1624 6.34658 11.0184C6.21058 10.8664 6.14258 10.6744 6.14258 10.4424V10.2384C6.14258 10.0064 6.21058 9.81836 6.34658 9.67436C6.49058 9.52236 6.71458 9.44636 7.01858 9.44636C7.32258 9.44636 7.54258 9.52236 7.67858 9.67436C7.82258 9.81836 7.89458 10.0064 7.89458 10.2384V10.4424C7.89458 10.6744 7.82258 10.8664 7.67858 11.0184C7.54258 11.1624 7.32258 11.2344 7.01858 11.2344Z"
                                            fill="#F9F8F4"
                                          />
                                        </svg>
                                        <span
                                          className={
                                            'font-plexsans text-[0.729vw] text-[#FF0000]'
                                          }
                                        >
                                          {errors.giftCode}
                                        </span>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <button
                                  type={'submit'}
                                  className={
                                    'mb-auto w-[3.646vw] rounded-[0.26vw] bg-middle-accent p-[0.313vw] text-center font-museo text-[0.729vw] font-medium hover:opacity-80'
                                  }
                                >
                                  Submit
                                </button>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      )}
                      {voucherMode == VoucherMode.UseValid && (
                        <div
                          className={
                            'flex w-[22.5vw] flex-col gap-[0.521vw] rounded-b-[0.521vw] bg-[#252525] p-[0.521vw]'
                          }
                        >
                          <span
                            className={
                              'font-plexsans text-[0.729vw] text-foreground'
                            }
                          >
                            Code <b className={'font-extrabold'}>{giftCode}</b>{' '}
                            is valid. Please fill the ticket numbers and receive
                            the ticket
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {(voucherMode == VoucherMode.Buy ||
                    voucherMode == VoucherMode.List ||
                    voucherMode == VoucherMode.BuySuccess) && (
                    <div
                      className={
                        'flex h-full w-[22.5vw] flex-col gap-0 rounded-b-[0.521vw] bg-[#252525]'
                      }
                    >
                      <div className={'flex w-full flex-row'}>
                        <button
                          className={cn(
                            'w-[40%] cursor-pointer rounded-t-[0.26vw] text-center font-plexsans text-[0.833vw] font-medium uppercase hover:opacity-80 disabled:cursor-default disabled:hover:opacity-100',
                            {
                              'border border-foreground text-foreground':
                                voucherMode != VoucherMode.Buy &&
                                voucherMode != VoucherMode.BuySuccess,
                              'bg-right-accent text-bg-dark':
                                voucherMode == VoucherMode.Buy ||
                                voucherMode == VoucherMode.BuySuccess,
                            }
                          )}
                          onClick={() => setVoucherMode(VoucherMode.Buy)}
                          disabled={voucherMode == VoucherMode.BuySuccess}
                        >
                          New Codes
                        </button>
                        <button
                          className={cn(
                            'w-[60%] cursor-pointer rounded-t-[0.26vw] bg-[#252525] text-center font-plexsans text-[0.833vw] font-medium uppercase hover:opacity-80',
                            {
                              'border border-foreground text-foreground':
                                voucherMode != VoucherMode.List,
                              'bg-right-accent text-bg-dark':
                                voucherMode == VoucherMode.List,
                            }
                          )}
                          onClick={() => setVoucherMode(VoucherMode.List)}
                        >
                          Already bought codes
                        </button>
                      </div>
                      {voucherMode == VoucherMode.Buy &&
                        boughtGiftCodes.length == 0 && (
                          <div
                            className={
                              'flex flex-col rounded-b-[0.521vw] bg-[#252525] px-[0.521vw] pb-[0.521vw] pt-[1.25vw]'
                            }
                          >
                            <div
                              className={
                                'flex w-[90%] flex-row items-center justify-between border-b border-foreground pb-[0.729vw]'
                              }
                            >
                              <span
                                className={
                                  'font-plexsans text-[0.833vw] font-medium text-foreground'
                                }
                              >
                                Add codes to cart
                              </span>
                              <div
                                className={cn(
                                  'flex h-[1.6vw] items-center justify-between rounded-[0.33vw]',
                                  'text-[1.07vw] text-[#252525]'
                                )}
                              >
                                <button
                                  className="cursor-pointer p-[0.3vw] hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
                                  onClick={() =>
                                    setGiftCodeToBuyAmount(
                                      (prevState) => prevState - 1
                                    )
                                  }
                                  disabled={giftCodeToBuyAmount - 1 < 1}
                                >
                                  <svg
                                    width="16"
                                    height="3"
                                    viewBox="0 0 16 3"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-[1.07vw]"
                                  >
                                    <path
                                      d="M0 0.5H16V2.5H0V0.5Z"
                                      fill="#F9F8F4"
                                    />
                                    <path
                                      d="M0 0.5H16V2.5H0V0.5Z"
                                      fill="#F9F8F4"
                                    />
                                  </svg>
                                </button>
                                <div className="mx-[0.4vw] text-foreground opacity-50">
                                  {giftCodeToBuyAmount}
                                </div>
                                <div
                                  className="cursor-pointer p-[0.3vw] hover:opacity-60"
                                  onClick={() =>
                                    setGiftCodeToBuyAmount(
                                      (prevState) => prevState + 1
                                    )
                                  }
                                >
                                  <svg
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-[1.07vw]"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M7 9.5V16.5H9V9.5H16V7.5H9V0.5H7V7.5H0V9.5H7Z"
                                      fill="#F9F8F4"
                                    />
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M7 9.5V16.5H9V9.5H16V7.5H9V0.5H7V7.5H0V9.5H7Z"
                                      fill="#F9F8F4"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <span
                              className={
                                'w-[90%] pt-[0.521vw] font-plexsans text-[0.729vw] text-foreground'
                              }
                            >
                              After paying for the gift codes, you can copy them
                              in this window and give them to your friends
                            </span>
                          </div>
                        )}
                      {voucherMode == VoucherMode.Buy &&
                        boughtGiftCodes.length != 0 && (
                          <div
                            className={
                              'flex flex-col rounded-b-[0.521vw] bg-[#252525] px-[0.521vw] pb-[0.521vw] pt-[1.25vw]'
                            }
                          >
                            <div
                              className={
                                'flex w-[90%] flex-row items-center justify-between border-b border-foreground pb-[0.729vw]'
                              }
                            >
                              <span
                                className={
                                  'font-plexsans text-[0.833vw] font-medium text-foreground'
                                }
                              >
                                Codes preparation
                              </span>
                            </div>
                            <span
                              className={
                                'w-[90%] pt-[0.521vw] font-plexsans text-[0.729vw] text-foreground'
                              }
                            >
                              After paying for the gift codes, you can copy them
                              in this window and give them to your friends
                            </span>
                            <div
                              className={
                                'mt-[0.781vw] flex w-full flex-row gap-[0.521vw]'
                              }
                            >
                              <div
                                className={
                                  'grid max-h-[6.771vw] w-full grid-cols-2 gap-x-[1.094vw] gap-y-[0.521vw] overflow-y-scroll pr-[0.5vw]'
                                }
                              >
                                {boughtGiftCodes.map((item, index) => (
                                  <BoughtGiftCode key={index} code={item} />
                                ))}
                              </div>
                              {/*<div></div>*/}
                            </div>
                            <button
                              className={
                                'mt-[0.521vw] w-full cursor-pointer rounded-[0.26vw] bg-right-accent py-[0.26vw] text-center font-museo text-[0.729vw] font-medium text-bg-dark hover:opacity-80'
                              }
                              onClick={() => copyCodes(boughtGiftCodes)}
                            >
                              Copy all
                            </button>
                          </div>
                        )}
                      {voucherMode == VoucherMode.List &&
                        userGiftCodes.length == 0 && (
                          <div
                            className={
                              'flex h-full flex-col items-center justify-between p-[0.521vw]'
                            }
                          >
                            <span
                              className={
                                'font-plexsans text-[0.729vw] text-foreground'
                              }
                            >
                              You haven&apos;t purchased the codes yet and you
                              don&apos;t have any available. Go to “NEW CODES”
                              or click button to purchase one.
                            </span>
                            <Image
                              src={noCodesImg}
                              alt={'No codes image'}
                              className={'my-[0.99vw] w-1/2'}
                            />
                            <button
                              className={
                                'w-full rounded-[0.26vw] bg-right-accent py-[0.26vw] text-center font-museo text-[0.729vw] font-medium text-bg-dark'
                              }
                              onClick={() => setVoucherMode(VoucherMode.Buy)}
                            >
                              Buy access gift codes
                            </button>
                          </div>
                        )}
                      {voucherMode == VoucherMode.List &&
                        userGiftCodes.length != 0 && (
                          <div
                            className={
                              'flex flex-col gap-[0.521vw] p-[0.521vw]'
                            }
                          >
                            <span
                              className={
                                'w-full font-plexsans text-[0.729vw] text-foreground'
                              }
                            >
                              The codes you already bought previously
                            </span>
                            <div className={'flex flex-col'}>
                              <div className={'grid grid-cols-5 pt-[0.521vw]'}>
                                <span
                                  className={
                                    'my-auto font-plexsans text-[0.729vw] text-foreground'
                                  }
                                >
                                  #
                                </span>
                                <span
                                  className={
                                    'col-span-2 my-auto font-plexsans text-[0.729vw] text-foreground'
                                  }
                                >
                                  Code
                                </span>
                                <span
                                  className={
                                    'my-auto font-plexsans text-[0.729vw] text-foreground'
                                  }
                                >
                                  Status
                                </span>
                              </div>
                            </div>
                            <div
                              className={
                                'flex max-h-[12vw] flex-col overflow-y-scroll pr-[0.5vw]'
                              }
                            >
                              {userGiftCodes.map((item, index) => (
                                <div
                                  key={index}
                                  className={
                                    'grid grid-cols-5 border-b border-foreground py-[0.521vw] first:border-t'
                                  }
                                >
                                  <span
                                    className={
                                      'my-auto font-plexsans text-[0.729vw] text-foreground'
                                    }
                                  >
                                    {index + 1}
                                  </span>
                                  <span
                                    className={
                                      'col-span-2 my-auto font-plexsans text-[0.729vw] text-foreground'
                                    }
                                  >
                                    {item.code}
                                  </span>
                                  <span
                                    className={cn(
                                      'my-auto font-plexsans text-[0.729vw] text-foreground',
                                      {
                                        'text-[#FF5B23]': item.used,
                                      }
                                    )}
                                  >
                                    {item.used ? 'Used' : 'Available'}
                                  </span>
                                  {!item.used && (
                                    <button
                                      className={
                                        'cursor-pointer rounded-[0.26vw] bg-right-accent text-center text-bg-dark hover:opacity-80'
                                      }
                                      onClick={() => copyCodes(item.code)}
                                    >
                                      Copy
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div
                              className={
                                'mt-[0.521vw] flex w-full flex-row gap-[0.521vw]'
                              }
                            >
                              <button
                                className={
                                  'w-full cursor-pointer rounded-[0.26vw] bg-middle-accent py-[0.26vw] font-museo text-[0.625vw] font-medium text-foreground hover:opacity-80'
                                }
                              >
                                Delete all used codes
                              </button>
                              <button
                                className={
                                  'w-full cursor-pointer rounded-[0.26vw] bg-right-accent py-[0.26vw] font-museo text-[0.625vw] font-medium text-bg-dark hover:opacity-80'
                                }
                                onClick={() =>
                                  copyCodes(
                                    userGiftCodes.map((item) => item.code)
                                  )
                                }
                              >
                                Copy all
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                  {(voucherMode == VoucherMode.Closed ||
                    voucherMode == VoucherMode.UseValid) && (
                    <div className={'flex flex-col gap-0'}>
                      <AnimatePresence>
                        {renderTickets.map((_, index) => (
                          <TicketCard
                            key={index}
                            index={index}
                            ticketsAmount={tickets.length}
                            addTicket={(ticket) => {
                              if (tickets.length == index) {
                                setTickets([...tickets, ticket]);
                              } else {
                                tickets[index] = ticket;
                              }
                              setBlankTicket(false);
                              notificationStore.create({
                                type: 'success',
                                message: `Ticket ${ticket.numbers.toString().replaceAll(',', '')} submitted`,
                                isDismissible: true,
                                dismissAfterDelay: true,
                              });
                            }}
                            removeTicketByIdx={(index: number) => {
                              if (tickets.length != 0) {
                                if (index == tickets.length) {
                                  setBlankTicket(false);
                                } else {
                                  tickets.splice(index, 1);
                                }

                                notificationStore.create({
                                  type: 'success',
                                  message: 'Ticket removed',
                                  isDismissible: true,
                                  dismissAfterDelay: true,
                                });
                              }
                            }}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className={'flex flex-col gap-[0.521vw]'}>
                  {voucherMode == VoucherMode.Closed ? (
                    <button
                      className={
                        'flex w-full cursor-pointer flex-row items-center justify-center gap-[0.781vw] rounded-[0.521vw] bg-[#252525] py-[0.365vw] hover:opacity-80'
                      }
                      onClick={() => setVoucherMode(VoucherMode.Buy)}
                    >
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={'my-[0.208vw] h-[1.302vw] w-[1.302vw]'}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.75 5.99952C6.74993 5.33115 6.95593 4.67901 7.33993 4.13196C7.72393 3.58491 8.26725 3.16955 8.89587 2.94248C9.52449 2.71541 10.2078 2.68768 10.8528 2.86305C11.4977 3.03843 12.0729 3.40839 12.5 3.92252C13.0438 3.26102 13.8267 2.84085 14.6785 2.75335C15.5303 2.66585 16.3823 2.91807 17.0492 3.45521C17.7161 3.99235 18.1441 4.77099 18.2401 5.62191C18.3361 6.47284 18.0924 7.32727 17.562 7.99952H18.5C18.8283 7.99952 19.1534 8.06419 19.4567 8.18982C19.76 8.31546 20.0356 8.49961 20.2678 8.73175C20.4999 8.9639 20.6841 9.2395 20.8097 9.54281C20.9353 9.84613 21 10.1712 21 10.4995V11.7495C21 11.9484 20.921 12.1392 20.7803 12.2799C20.6397 12.4205 20.4489 12.4995 20.25 12.4995H13.55C13.5106 12.4995 13.4716 12.4918 13.4352 12.4767C13.3988 12.4616 13.3657 12.4395 13.3379 12.4117C13.31 12.3838 13.2879 12.3507 13.2728 12.3143C13.2578 12.2779 13.25 12.2389 13.25 12.1995V8.73952C12.9674 8.55836 12.7145 8.33474 12.5 8.07652C12.2855 8.33438 12.0325 8.55767 11.75 8.73852V12.1995C11.75 12.2791 11.7184 12.3554 11.6621 12.4117C11.6059 12.4679 11.5296 12.4995 11.45 12.4995H4.75C4.55109 12.4995 4.36032 12.4205 4.21967 12.2799C4.07902 12.1392 4 11.9484 4 11.7495V10.4995C4 10.1712 4.06466 9.84613 4.1903 9.54281C4.31594 9.2395 4.50009 8.9639 4.73223 8.73175C4.96438 8.49961 5.23998 8.31546 5.54329 8.18982C5.84661 8.06419 6.1717 7.99952 6.5 7.99952H7.438C6.99113 7.42873 6.74885 6.72443 6.75 5.99952ZM11.75 5.99952C11.75 5.53539 11.5656 5.09027 11.2374 4.76208C10.9092 4.4339 10.4641 4.24952 10 4.24952C9.53587 4.24952 9.09075 4.4339 8.76256 4.76208C8.43437 5.09027 8.25 5.53539 8.25 5.99952C8.25 6.46365 8.43437 6.90877 8.76256 7.23696C9.09075 7.56515 9.53587 7.74952 10 7.74952C10.4641 7.74952 10.9092 7.56515 11.2374 7.23696C11.5656 6.90877 11.75 6.46365 11.75 5.99952ZM13.25 5.99952C13.25 6.22933 13.2953 6.4569 13.3832 6.66922C13.4712 6.88154 13.6001 7.07446 13.7626 7.23696C13.9251 7.39946 14.118 7.52836 14.3303 7.61631C14.5426 7.70426 14.7702 7.74952 15 7.74952C15.2298 7.74952 15.4574 7.70426 15.6697 7.61631C15.882 7.52836 16.0749 7.39946 16.2374 7.23696C16.3999 7.07446 16.5288 6.88154 16.6168 6.66922C16.7047 6.4569 16.75 6.22933 16.75 5.99952C16.75 5.53539 16.5656 5.09027 16.2374 4.76208C15.9092 4.4339 15.4641 4.24952 15 4.24952C14.5359 4.24952 14.0908 4.4339 13.7626 4.76208C13.4344 5.09027 13.25 5.53539 13.25 5.99952Z"
                          fill="#F9F8F4"
                        />
                        <path
                          d="M11.7516 14.1496C11.7516 14.07 11.72 13.9937 11.6638 13.9375C11.6075 13.8812 11.5312 13.8496 11.4516 13.8496H6.15062C5.95431 13.8498 5.76439 13.9194 5.61437 14.046C5.46434 14.1726 5.36385 14.3481 5.33062 14.5416C5.10854 15.8375 5.10854 17.1617 5.33062 18.4576L5.55462 19.7666C5.62819 20.1955 5.83912 20.589 6.15564 20.8876C6.47216 21.1863 6.87715 21.374 7.30962 21.4226L8.37462 21.5416C9.39488 21.6557 10.4194 21.7274 11.4456 21.7566C11.4855 21.7577 11.5252 21.7507 11.5624 21.7362C11.5995 21.7216 11.6334 21.6997 11.6619 21.6719C11.6904 21.644 11.7131 21.6106 11.7285 21.5738C11.7439 21.537 11.7518 21.4975 11.7516 21.4576V14.1496ZM13.5576 21.7566C13.5177 21.7577 13.478 21.7507 13.4409 21.7362C13.4037 21.7216 13.3699 21.6997 13.3414 21.6719C13.3128 21.644 13.2902 21.6106 13.2748 21.5738C13.2593 21.537 13.2515 21.4975 13.2516 21.4576V14.1496C13.2516 14.07 13.2832 13.9937 13.3395 13.9375C13.3958 13.8812 13.4721 13.8496 13.5516 13.8496H18.8526C19.2586 13.8496 19.6046 14.1416 19.6726 14.5416C19.8956 15.8376 19.8956 17.1616 19.6726 18.4576L19.4496 19.7666C19.376 20.1957 19.1649 20.5892 18.8482 20.8879C18.5315 21.1866 18.1263 21.3742 17.6936 21.4226L16.6286 21.5416C15.6084 21.6556 14.5838 21.7274 13.5576 21.7566Z"
                          fill="#F9F8F4"
                        />
                      </svg>
                      <span
                        className={
                          'mt-[0.208vw] font-museo text-[0.833vw] font-medium text-foreground'
                        }
                      >
                        Generate gift access code
                      </span>
                    </button>
                  ) : (
                    <button
                      className={
                        'mb-[0.521vw] flex h-[1.354vw] w-[3.802vw] flex-row items-center justify-center rounded-[0.144vw] border border-foreground hover:opacity-80'
                      }
                      onClick={() => setVoucherMode(VoucherMode.Closed)}
                    >
                      <svg
                        width="0.378vw"
                        height="0.781vw"
                        viewBox="0 0 9 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={'mr-[0.26vw] h-[0.781vw] w-[0.378vw]'}
                      >
                        <path
                          d="M8.36328 0.5L1.10522 8L8.36328 15.5"
                          stroke="#F9F8F4"
                        />
                      </svg>
                      <span
                        className={
                          'pt-px font-museo text-[0.729vw] font-medium text-foreground'
                        }
                      >
                        Back
                      </span>
                    </button>
                  )}
                  <div
                    className={'flex flex-col gap-[1.33vw]'}
                    id={'ticketsToBuy'}
                  >
                    <BuyInfoCard
                      buttonActive={
                        workerClientStore.lotteryCompiled &&
                        !workerClientStore.isActiveTx &&
                        tickets.length > 0 &&
                        tickets[0].amount != 0
                      }
                      ticketsInfo={tickets}
                      loaderActive={
                        workerClientStore.lotteryCompiled &&
                        workerClientStore.isActiveTx
                      }
                      onFinally={() => {
                        setTickets([]);
                      }}
                    />
                    {/*<GetMoreTicketsButton*/}
                    {/*  disabled={blankTicket}*/}
                    {/*  onClick={() => {*/}
                    {/*    setBlankTicket(true);*/}
                    {/*  }}*/}
                    {/*/>*/}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <PreviousRounds />
    </div>
  );
}
