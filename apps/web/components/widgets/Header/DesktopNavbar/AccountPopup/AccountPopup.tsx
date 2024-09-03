import { cn } from '@/lib/helpers';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNetworkStore } from '@/lib/stores/network';
import { useBridgeStore } from '@/lib/stores/bridgeStore';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import dynamic from 'next/dynamic';
import { api } from '@/trpc/react';
import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';
import handEmojiImg from '@/public/image/misc/handEmoji.svg';
import avatarUnset from '@/public/image/avatars/avatar-unset.svg';
import avatar1 from '@/public/image/avatars/avatar-1.svg';
import avatar2 from '@/public/image/avatars/avatar-2.svg';
import avatar3 from '@/public/image/avatars/avatar-3.svg';
import avatar4 from '@/public/image/avatars/avatar-4.svg';
import avatar5 from '@/public/image/avatars/avatar-5.svg';
import avatar6 from '@/public/image/avatars/avatar-6.svg';
import avatar7 from '@/public/image/avatars/avatar-7.svg';
import avatar8 from '@/public/image/avatars/avatar-8.svg';
import avatar9 from '@/public/image/avatars/avatar-9.svg';
import avatar10 from '@/public/image/avatars/avatar-10.svg';
import avatar11 from '@/public/image/avatars/avatar-11.svg';
import avatar12 from '@/public/image/avatars/avatar-12.svg';
import avatar13 from '@/public/image/avatars/avatar-13.svg';
import avatar14 from '@/public/image/avatars/avatar-14.svg';
import avatar15 from '@/public/image/avatars/avatar-15.svg';
import avatar16 from '@/public/image/avatars/avatar-16.svg';
import avatar17 from '@/public/image/avatars/avatar-17.svg';
import avatar18 from '@/public/image/avatars/avatar-18.svg';
import avatar19 from '@/public/image/avatars/avatar-19.svg';
import avatar20 from '@/public/image/avatars/avatar-20.svg';
import avatar21 from '@/public/image/avatars/avatar-21.svg';
import Image from 'next/image';

const avatars = [
  avatarUnset,
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
  avatar16,
  avatar17,
  avatar18,
  avatar19,
  avatar20,
  avatar21,
];

const AccountPopupBalance = dynamic(
  () => import('./nonSSR/AccountPopupBalance'),
  {
    ssr: false,
  }
);

export default function AccountPopup({
  setIsAccountOpen,
}: {
  setIsAccountOpen: (isOpen: boolean) => void;
}) {
  const networkStore = useNetworkStore();
  const bridgeStore = useBridgeStore();
  const notificationStore = useNotificationStore();
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [testName, setTestName] = useState<string>('');
  const [changeNameMode, setChangeNameMode] = useState<boolean>(false);
  const [avatarId, setAvatarId] = useState<number | undefined>(undefined);
  const [avatarMode, setAvatarMode] = useState<boolean>(false);

  const getAccountQuery = api.accounts.getAccount.useQuery({
    userAddress: networkStore.address || '',
  });
  const getNameCheckQuery = api.accounts.checkNameUnique.useQuery({
    name: testName,
  });

  const setNameMutation = api.accounts.setName.useMutation();
  const setAvatarMutation = api.accounts.setAvatar.useMutation();

  useEffect(() => {
    if (getAccountQuery.data) {
      if (getAccountQuery.data.account) {
        if (getAccountQuery.data.account.name)
          setName(getAccountQuery.data.account.name);
        if (getAccountQuery.data.account.avatarId)
          setAvatarId(getAccountQuery.data.account.avatarId);
      }
    }
  }, [getAccountQuery.data]);

  useEffect(() => {
    if (bridgeStore.open) setIsAccountOpen(false);
  }, [bridgeStore.open]);

  const copyLink = () => {
    if (networkStore.address) {
      navigator.clipboard.writeText(networkStore.address.toString());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 10000);
    } else throw new Error('No address');
  };

  const validateSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^(?![\d+_@.-]+$)[a-zA-Z0-9+_@.-]*$/, 'Invalid name')
      .required('This field required')
      .test('Check name unique', 'This name already exists', (userName) =>
        userName != name ? getNameCheckQuery.data : true
      ),
  });

  const disconnectWallet = () => {
    networkStore
      .onWalletConnected(undefined)
      .then(() => {
        console.log('Wallet disconnected');
      })
      .catch((err) => {
        console.log('Error while disconnect', err);
      });
    setIsAccountOpen(false);
  };

  const submitForm = (userName: string) => {
    if (!networkStore.address) return;
    if (name !== undefined && userName == name) {
      setChangeNameMode(false);
      return;
    }
    setNameMutation.mutate({
      userAddress: networkStore.address,
      name: userName,
    });
    setName(userName);
    setChangeNameMode(false);
    notificationStore.create({
      type: 'message',
      message: `Hi ${name ? 'again' : ''} ${userName}!`,
      customIcon: handEmojiImg,
    });
  };

  return (
    <motion.div
      className={
        'absolute -right-2 top-0 z-20 flex max-w-[500px] flex-col rounded-[10px] bg-right-accent p-10'
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={'flex w-full flex-row justify-between'}>
        <div className={'flex w-full flex-row items-center gap-2'}>
          <svg
            width="26"
            height="27"
            viewBox="0 0 26 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.0002 15.4319C15.5492 15.4319 17.6155 13.3656 17.6155 10.8166C17.6155 8.26755 15.5492 6.20117 13.0002 6.20117C10.4511 6.20117 8.38477 8.26755 8.38477 10.8166C8.38477 13.3656 10.4511 15.4319 13.0002 15.4319Z"
              stroke="#252525"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.1167 22.6314C5.94053 21.2791 7.09838 20.1615 8.47893 19.3861C9.85949 18.6105 11.4163 18.2031 12.9998 18.2031C14.5832 18.2031 16.1401 18.6105 17.5206 19.3861C18.9012 20.1615 20.059 21.2791 20.8829 22.6314"
              stroke="#252525"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 25.5859C19.6275 25.5859 25 20.2134 25 13.5859C25 6.95852 19.6275 1.58594 13 1.58594C6.37258 1.58594 1 6.95852 1 13.5859C1 20.2134 6.37258 25.5859 13 25.5859Z"
              stroke="#252525"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={'font-museo text-headline-3 text-bg-dark'}>
            Account
          </span>
        </div>
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={'cursor-pointer hover:opacity-80'}
          onClick={() => setIsAccountOpen(false)}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.181 12.5912L24.0003 2.76778L21.8193 0.585938L12 10.4093L2.18093 0.586143L0 2.76799L9.8191 12.5912L0.00998605 22.4044L2.19092 24.5862L12 14.773L21.8093 24.5864L23.9903 22.4046L14.181 12.5912Z"
            fill="#252525"
          />
        </svg>
      </div>
      {avatarMode ? (
        <div className={'mt-8 flex h-full w-full flex-col'}>
          <div className={'flex w-full flex-row items-center justify-between'}>
            <div
              className={'font-museo text-[0.833vw] font-medium text-bg-dark'}
            >
              Avatars
            </div>
            <button
              className={
                'flex h-[1.354vw] w-[3.802vw] flex-row items-center justify-center rounded-[0.144vw] border border-bg-dark hover:opacity-80'
              }
              onClick={() => setAvatarMode(false)}
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
                  stroke="#212121"
                />
              </svg>
              <span
                className={
                  'pt-px font-museo text-[0.729vw] font-medium text-bg-dark'
                }
              >
                Back
              </span>
            </button>
          </div>
          <div className={'mt-[0.573vw] grid grid-cols-5 gap-[0.521vw]'}>
            {avatars.map(
              (item, index) =>
                index != 0 && (
                  <div
                    key={index}
                    className={cn('relative cursor-pointer', {
                      'cursor-not-allowed': index == avatarId,
                      'hover:opacity-80': index != avatarId,
                    })}
                    onClick={() => {
                      if (!networkStore.address) return;
                      if (index == avatarId) {
                        setAvatarMode(false);
                        return;
                      }
                      setAvatarId(index);
                      setAvatarMutation.mutate({
                        userAddress: networkStore.address,
                        avatarId: index,
                      });
                      setAvatarMode(false);
                      notificationStore.create({
                        type: 'success',
                        message: 'Avatar changed successfully!',
                      });
                    }}
                  >
                    <Image
                      src={item}
                      alt={'Avatar'}
                      className={cn('h-[3.125vw] w-[3.125vw]', {
                        'opacity-20': index == avatarId,
                      })}
                    />
                    {index == avatarId && (
                      <div
                        className={
                          'absolute bottom-[10%] w-full text-center font-plexsans text-[0.781vw] font-extrabold text-bg-dark'
                        }
                      >
                        Chosen
                      </div>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      ) : (
        <div className={'mt-8 flex w-full flex-col gap-4'}>
          <div className={'flex flex-row gap-[0.521vw]'}>
            <Image
              src={avatarId !== undefined ? avatars[avatarId] : avatars[0]}
              alt={'User Avatar'}
              className={'h-[5vw] w-[5vw] cursor-pointer hover:opacity-80'}
              onClick={() => (avatarMode ? undefined : setAvatarMode(true))}
            />
            <div className={'flex w-full flex-col gap-4'}>
              <Formik
                initialValues={{ name: name || '' }}
                validationSchema={validateSchema}
                onSubmit={(values) => submitForm(values.name)}
              >
                {({ errors, touched, values }) => (
                  <Form
                    onChange={(e) => {
                      // @ts-ignore
                      setTestName(e.target.value);
                    }}
                  >
                    {name && !changeNameMode ? (
                      <div
                        className={
                          'w-full cursor-pointer font-museo text-headline-1 font-medium text-bg-dark hover:opacity-80'
                        }
                        onClick={() => setChangeNameMode(true)}
                      >
                        {name}
                      </div>
                    ) : (
                      <div className={'flex flex-col gap-2'}>
                        <div className={'flex flex-row gap-2'}>
                          <Field
                            name={'name'}
                            type={'text'}
                            placeholder={'Type your nickname..'}
                            className={
                              'w-full rounded-[5px] border border-bg-dark bg-right-accent px-2 py-1 text-center font-plexsans text-main font-normal text-bg-dark placeholder:text-[#252525] placeholder:opacity-60'
                            }
                          />
                          {values.name.length == 0 && name ? (
                            <button
                              className={
                                'group flex cursor-pointer flex-col items-center justify-center rounded-[5px] border border-bg-dark bg-bg-dark p-1 hover:bg-right-accent hover:opacity-80'
                              }
                              onClick={() => setChangeNameMode(false)}
                            >
                              <svg
                                width="24"
                                height="25"
                                viewBox="0 0 24 25"
                                fill="#F9F8F4"
                                xmlns="http://www.w3.org/2000/svg"
                                className={'group-hover:fill-bg-dark'}
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M14.181 12.5912L24.0003 2.76778L21.8193 0.585938L12 10.4093L2.18093 0.586143L0 2.76799L9.8191 12.5912L0.00998605 22.4044L2.19092 24.5862L12 14.773L21.8093 24.5864L23.9903 22.4046L14.181 12.5912Z"
                                  fill="#F9F8F4"
                                  className={'group-hover:fill-bg-dark'}
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              type={'submit'}
                              className={
                                'group flex cursor-pointer flex-col items-center justify-center rounded-[5px] border border-bg-dark bg-bg-dark p-1 hover:bg-right-accent hover:opacity-80'
                              }
                            >
                              <svg
                                aria-hidden="true"
                                role="presentation"
                                viewBox="0 0 17 18"
                                className={'h-6 w-6'}
                              >
                                <polyline
                                  fill="none"
                                  points="1 9 7 14 15 4"
                                  stroke="#F9F8F4"
                                  className={'group-hover:stroke-bg-dark'}
                                  strokeDasharray="22"
                                  strokeDashoffset="44"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                        <AnimatePresence>
                          {errors.name && touched.name && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                type: 'spring',
                                duration: 0.8,
                                bounce: 0,
                              }}
                              className={'flex w-full flex-row gap-2'}
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
                                  'font-plexsans text-[14px]/[14px] text-[#FF0000]'
                                }
                              >
                                {errors.name}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
              <div
                className={cn('flex w-full flex-row gap-2', {
                  'cursor-pointer': !linkCopied,
                  'cursor-default': linkCopied,
                })}
                onClick={() => {
                  !linkCopied ? copyLink() : undefined;
                }}
              >
                <div
                  className={cn(
                    'w-full rounded-[5px] border border-bg-dark px-2 py-1 text-center text-bg-dark',
                    {
                      'opacity-60': linkCopied,
                    }
                  )}
                >
                  {networkStore.address &&
                    networkStore.address.slice(0, 15) + '...'}
                </div>
                <AnimatePresence>
                  {linkCopied ? (
                    <div
                      className={
                        'relative flex h-full items-center justify-center rounded-[5px] border border-bg-dark bg-bg-dark p-1'
                      }
                    >
                      <motion.svg
                        aria-hidden="true"
                        role="presentation"
                        viewBox="0 0 17 18"
                        className={'h-6 w-6'}
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
                        'group flex h-full items-center justify-center rounded-[5px] border border-bg-dark bg-bg-dark p-1 hover:bg-right-accent'
                      }
                    >
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={'h-6 w-6'}
                      >
                        <path
                          d="M11 20C12.3256 19.9984 13.5964 19.4711 14.5338 18.5338C15.4711 17.5965 15.9984 16.3256 16 15V6.24302C16.0016 5.71738 15.8988 5.19665 15.6976 4.71104C15.4964 4.22542 15.2008 3.78456 14.828 3.41402L12.586 1.17202C12.2155 0.799191 11.7746 0.50362 11.289 0.302438C10.8034 0.101255 10.2826 -0.00153795 9.757 1.73896e-05H5C3.67441 0.00160525 2.40356 0.528899 1.46622 1.46624C0.528882 2.40358 0.00158786 3.67442 0 5.00002V15C0.00158786 16.3256 0.528882 17.5965 1.46622 18.5338C2.40356 19.4711 3.67441 19.9984 5 20H11ZM2 15V5.00002C2 4.20437 2.31607 3.44131 2.87868 2.8787C3.44129 2.31609 4.20435 2.00002 5 2.00002C5 2.00002 9.919 2.01402 10 2.02402V4.00002C10 4.53045 10.2107 5.03916 10.5858 5.41423C10.9609 5.7893 11.4696 6.00002 12 6.00002H13.976C13.986 6.08102 14 15 14 15C14 15.7957 13.6839 16.5587 13.1213 17.1213C12.5587 17.6839 11.7956 18 11 18H5C4.20435 18 3.44129 17.6839 2.87868 17.1213C2.31607 16.5587 2 15.7957 2 15ZM20 8.00002V19C19.9984 20.3256 19.4711 21.5965 18.5338 22.5338C17.5964 23.4711 16.3256 23.9984 15 24H6C5.73478 24 5.48043 23.8947 5.29289 23.7071C5.10536 23.5196 5 23.2652 5 23C5 22.7348 5.10536 22.4804 5.29289 22.2929C5.48043 22.1054 5.73478 22 6 22H15C15.7956 22 16.5587 21.6839 17.1213 21.1213C17.6839 20.5587 18 19.7957 18 19V8.00002C18 7.7348 18.1054 7.48045 18.2929 7.29291C18.4804 7.10537 18.7348 7.00002 19 7.00002C19.2652 7.00002 19.5196 7.10537 19.7071 7.29291C19.8946 7.48045 20 7.7348 20 8.00002Z"
                          fill="#F9F8F4"
                          className={'group-hover:fill-bg-dark'}
                        />
                      </svg>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <AccountPopupBalance />
          <div className={'flex w-full flex-row gap-1.5'}>
            <button
              className={
                'group flex w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[5px] border border-bg-dark bg-bg-dark p-1 text-foreground hover:bg-right-accent hover:text-bg-dark'
              }
            >
              <svg
                width="15"
                height="21"
                viewBox="0 0 15 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 10.5859C8.48891 10.5859 9.45561 10.2927 10.2779 9.74329C11.1001 9.19388 11.741 8.41299 12.1194 7.49936C12.4978 6.58573 12.5969 5.58039 12.4039 4.61049C12.211 3.64058 11.7348 2.74967 11.0355 2.05041C10.3363 1.35114 9.44536 0.874939 8.47545 0.682013C7.50555 0.489087 6.50021 0.588104 5.58658 0.966542C4.67295 1.34498 3.89206 1.98584 3.34265 2.80809C2.79324 3.63033 2.5 4.59703 2.5 5.58594C2.50132 6.91162 3.02853 8.18262 3.96593 9.12001C4.90332 10.0574 6.17432 10.5846 7.5 10.5859ZM7.5 2.25261C8.15927 2.25261 8.80374 2.4481 9.3519 2.81437C9.90006 3.18065 10.3273 3.70124 10.5796 4.31033C10.8319 4.91942 10.8979 5.58964 10.7693 6.23624C10.6407 6.88284 10.3232 7.47679 9.85702 7.94296C9.39085 8.40914 8.79691 8.72661 8.1503 8.85522C7.5037 8.98384 6.83348 8.91783 6.22439 8.66554C5.6153 8.41325 5.09471 7.986 4.72843 7.43784C4.36216 6.88968 4.16667 6.24521 4.16667 5.58594C4.16667 4.70188 4.51786 3.85404 5.14298 3.22892C5.7681 2.6038 6.61595 2.25261 7.5 2.25261Z"
                  fill="#F9F8F4"
                  className={'group-hover:fill-bg-dark'}
                />
                <path
                  d="M7.5 12.252C5.51162 12.2544 3.60538 13.0453 2.19938 14.4513C0.793381 15.8573 0.0024258 17.7636 0 19.7519C0 19.9729 0.0877974 20.1849 0.244078 20.3412C0.400358 20.4975 0.61232 20.5853 0.833333 20.5853C1.05435 20.5853 1.26631 20.4975 1.42259 20.3412C1.57887 20.1849 1.66667 19.9729 1.66667 19.7519C1.66667 18.2048 2.28125 16.7211 3.37521 15.6272C4.46917 14.5332 5.9529 13.9186 7.5 13.9186C9.0471 13.9186 10.5308 14.5332 11.6248 15.6272C12.7188 16.7211 13.3333 18.2048 13.3333 19.7519C13.3333 19.9729 13.4211 20.1849 13.5774 20.3412C13.7337 20.4975 13.9457 20.5853 14.1667 20.5853C14.3877 20.5853 14.5996 20.4975 14.7559 20.3412C14.9122 20.1849 15 19.9729 15 19.7519C14.9976 17.7636 14.2066 15.8573 12.8006 14.4513C11.3946 13.0453 9.48838 12.2544 7.5 12.252Z"
                  fill="#F9F8F4"
                  className={'group-hover:fill-bg-dark'}
                />
              </svg>
              <span className={'font-museo text-[16px]/[16px] font-medium'}>
                Profile Information
              </span>
            </button>
            <button
              className={
                'group flex w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[5px] border border-bg-dark bg-bg-dark p-1 text-foreground hover:bg-right-accent hover:text-bg-dark'
              }
              onClick={disconnectWallet}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.6665 6.41927L13.4915 7.59427L15.6415 9.7526H7.1665V11.4193H15.6415L13.4915 13.5693L14.6665 14.7526L18.8332 10.5859M3.83317 4.7526H10.4998V3.08594H3.83317C2.9165 3.08594 2.1665 3.83594 2.1665 4.7526V16.4193C2.1665 17.3359 2.9165 18.0859 3.83317 18.0859H10.4998V16.4193H3.83317V4.7526Z"
                  fill="#F9F8F4"
                  className={'group-hover:fill-bg-dark'}
                />
              </svg>
              <span className={'font-museo text-[16px]/[16px] font-medium'}>
                Disconnect Wallet
              </span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
