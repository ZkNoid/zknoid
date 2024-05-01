import { Input } from '@/components/ui/games-store/shared/Input';
import { useState } from 'react';
import Image from 'next/image';
import znakesImg from '@/public/image/tokens/znakes.svg';
import { Popover } from '@/components/ui/games-store/shared/Popover';
import { Checkbox } from '@/components/ui/games-store/shared/Checkbox';
import { Button } from '@/components/ui/games-store/shared/Button';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/games-store/shared/Modal';
import { Currency } from '@/constants/currency';
import { useNetworkStore } from '@/lib/stores/network';
import { useProtokitBalancesStore } from '@/lib/stores/protokitBalances';

export const CreateNewLobby = ({
  createLobby,
  setIsCreationMode,
}: {
  createLobby: (
    name: string,
    participationFee: number,
    privateLobby: boolean
  ) => Promise<void>;
  setIsCreationMode: (val: boolean) => void;
}) => {
  const [newLobbyName, setNewLobbyName] = useState<string>('');
  const [isNewLobbyNameInvalid, setIsNewLobbyNameInvalid] =
    useState<boolean>(false);
  const [participationFee, setParticipationFee] = useState<number>(0);
  const [isParticipantFeeInvalid, setIsParticipantFeeInvalid] =
    useState<boolean>(false);
  const [isPrivateGame, setIsPrivateGame] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  const networkStore = useNetworkStore();
  const protokitBalances = useProtokitBalancesStore();

  const balance = (
    Number(protokitBalances.balances[networkStore.address!] ?? 0n) /
    10 ** 9
  ).toFixed(2);

  const checkFieldsValidity = () => {
    if (
      newLobbyName.length === 0 ||
      newLobbyName === '' ||
      newLobbyName === undefined
    ) {
      setIsNewLobbyNameInvalid(true);
      return false;
    } else setIsNewLobbyNameInvalid(false);

    if (participationFee > Number(balance) || participationFee === undefined) {
      setIsParticipantFeeInvalid(true);
      return false;
    } else setIsParticipantFeeInvalid(false);

    if (!isNewLobbyNameInvalid && !isParticipantFeeInvalid) return true;
    else return false;
  };

  return (
    <motion.div
      className={'col-start-4 col-end-6 row-span-4 w-full'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
    >
      <div
        className={
          'flex h-full w-full flex-col rounded-[5px] border border-foreground bg-[#252525] p-2'
        }
      >
        <div className={'flex flex-col gap-4 pb-4'}>
          <div className={'flex flex-row'}>
            <div
              className={'flex w-full flex-row items-start justify-start gap-1'}
            >
              <svg
                width="36"
                height="30"
                viewBox="0 0 36 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.73816 5.70065C10.4425 5.70065 11.8279 7.13886 11.8279 8.84383C11.8279 10.601 10.4418 11.987 8.68468 11.987C6.9797 11.9335 5.59497 10.5482 5.59497 8.791C5.59497 7.08602 7.03319 5.70065 8.73816 5.70065ZM1.9189 14.3312L3.03751 15.4505C3.40995 15.8229 3.94348 15.8229 4.3694 15.5568L5.06209 14.9704C5.59497 15.29 6.1807 15.5568 6.8199 15.7166L6.92622 16.6754C6.97906 17.1541 7.3515 17.5279 7.83155 17.5279H9.4302C9.96244 17.5279 10.3349 17.1541 10.4412 16.6754L10.5475 15.7166C11.1339 15.5568 11.7737 15.3428 12.306 14.9704L13.105 15.6103C13.4252 15.8757 14.0103 15.8757 14.3299 15.5568L15.5026 14.384C15.8222 14.0644 15.8757 13.4794 15.5555 13.1056L14.9163 12.306C15.2359 11.7737 15.4492 11.2409 15.609 10.6551L16.6213 10.5482C17.1007 10.4947 17.4737 10.0688 17.4737 9.59L17.5266 7.99135C17.5266 7.51259 17.1528 7.08538 16.6741 7.03254L15.5555 6.87274C15.4492 6.33921 15.2359 5.86045 14.9163 5.38105L15.609 4.52791C15.9286 4.10199 15.9286 3.56975 15.5555 3.19667L14.4362 2.07806C14.1166 1.75846 13.5316 1.70498 13.1578 2.02458L12.3053 2.66314C11.8259 2.39637 11.2396 2.1309 10.7073 2.02458L10.6004 0.90597C10.5475 0.425922 10.121 0.0534818 9.64284 0.0534818L8.04418 0C7.56478 0 7.13822 0.373084 7.08538 0.852488L6.97906 1.91761C6.33921 2.07742 5.80697 2.29005 5.27408 2.60966L4.4216 1.91761C4.04851 1.65149 3.51691 1.65149 3.14319 2.02458L2.02458 3.14319C1.65214 3.46214 1.65214 4.04851 1.91826 4.42095L2.55682 5.21996C2.23722 5.75349 2.02458 6.28573 1.86478 6.87209L0.852488 6.97841C0.37244 7.08473 0 7.45782 0 7.93722V9.53588C0 10.0681 0.373084 10.4406 0.852488 10.494L1.81194 10.6545C1.9711 11.2402 2.18438 11.7731 2.50334 12.3053L1.86478 13.0515C1.54517 13.4239 1.59866 13.9575 1.91826 14.3299L1.9189 14.3312Z"
                  fill="#D2FF00"
                />
                <path
                  d="M24.0256 23.1743C21.9482 22.961 20.4031 21.0969 20.5622 19.0188C20.7761 16.9407 22.6409 15.3956 24.7183 15.556C26.8492 15.7693 28.3938 17.6341 28.1811 19.7115C28.0213 21.7895 26.1565 23.3341 24.0256 23.1743ZM32.923 17.6875C32.8166 17.0477 32.604 16.4085 32.3366 15.7693L33.403 14.6507C33.7226 14.2776 33.7226 13.7447 33.403 13.3716L31.9107 11.6145C31.6446 11.2407 31.0582 11.1344 30.6323 11.4005L29.3545 12.2537C28.821 11.8277 28.1811 11.5088 27.5426 11.2414L27.4891 9.69684C27.4891 9.21744 27.0625 8.79152 26.6366 8.73803L24.2918 8.57759C23.813 8.52411 23.3871 8.845 23.2795 9.32376L22.9599 10.7626C22.2143 10.9224 21.4695 11.1357 20.829 11.4553L19.7639 10.3895C19.3914 10.0699 18.805 10.0699 18.4848 10.3895L16.6741 11.8812C16.3004 12.148 16.1941 12.7337 16.5137 13.1596L17.2592 14.3317C16.8333 14.9709 16.5137 15.6108 16.2469 16.3028L14.8629 16.3557C14.3293 16.3557 13.9569 16.7294 13.904 17.2081L13.6914 19.4995C13.6914 20.0324 14.0104 20.4576 14.4363 20.5646L15.8223 20.8314C15.9286 21.5775 16.1413 22.2689 16.4609 22.9088L15.5027 23.9211C15.1825 24.2942 15.1825 24.8264 15.5027 25.1995L16.9409 26.9573C17.2599 27.3839 17.7934 27.4373 18.2722 27.1706L19.3379 26.4244C19.9771 26.9045 20.6705 27.2769 21.3631 27.5437L21.4166 28.8756C21.4166 29.3543 21.7891 29.7809 22.2678 29.7809L24.5585 29.9942C25.0914 30.047 25.5186 29.728 25.6249 29.248L25.8917 27.9696C26.6907 27.8098 27.4369 27.5437 28.1289 27.2234L29.1412 28.1822C29.5149 28.5025 30.0472 28.5025 30.419 28.1822L32.2309 26.6912C32.6046 26.4238 32.6581 25.838 32.3907 25.4128L31.5924 24.24C32.0176 23.6015 32.3372 22.9616 32.6046 22.2683L34.0422 22.2155C34.5216 22.2155 34.9482 21.843 35.0017 21.363L35.2143 19.0723C35.2143 18.5394 34.8953 18.1135 34.4153 18.0065L32.923 17.6875Z"
                  fill="#F9F8F4"
                />
              </svg>
              <span className={'text-headline-3 uppercase text-left-accent'}>
                Lobby Creation
              </span>
            </div>
            <div className={'flex w-[30%] items-center justify-end'}>
              <svg
                width="53"
                height="64"
                viewBox="0 0 53 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'h-[50px] w-[50px] cursor-pointer hover:opacity-80'}
                onClick={() => setIsCreationMode(false)}
              >
                <rect
                  x="13.5469"
                  y="16.7344"
                  width="40"
                  height="4"
                  transform="rotate(45 13.5469 16.7344)"
                  fill="#D2FF00"
                />
                <rect
                  x="41.8438"
                  y="19.5625"
                  width="40"
                  height="4"
                  transform="rotate(135 41.8438 19.5625)"
                  fill="#D2FF00"
                />
              </svg>
            </div>
          </div>

          <Input
            value={newLobbyName}
            setValue={setNewLobbyName}
            type={'text'}
            inputMode={'text'}
            title={'Enter The Name of Lobby'}
            placeholder={'Type name here...'}
            isRequired={true}
            isInvalid={isNewLobbyNameInvalid}
            invalidMessage={'Please fill out this field correctly'}
            emptyFieldCheck={false}
            isClearable={true}
          />
          <div className={'flex w-full flex-row gap-4'}>
            <Input
              title={'Participant fee'}
              placeholder={'Type participant fee here...'}
              type={'number'}
              inputMode={'numeric'}
              value={participationFee}
              setValue={setParticipationFee}
              isRequired={true}
              isInvalid={isParticipantFeeInvalid}
              invalidMessage={'Please fill out this field correctly'}
              emptyFieldCheck={false}
              isClearable={true}
              endContent={
                <div
                  className={
                    'flex h-[28px] w-[28px] items-center justify-center rounded-full'
                  }
                >
                  <Image src={znakesImg} alt={'Znakes Tokens'} />
                </div>
              }
            />
            <div
              className={
                'flex w-[60%] items-center justify-start gap-2 font-plexsans text-left-accent'
              }
            >
              <span>Balance:</span>
              <span>{balance}</span>
              <span>{Currency.ZNAKES}</span>
            </div>
          </div>
          <div className={'flex max-w-[35%] flex-row justify-between'}>
            <div className={'flex flex-row gap-1'}>
              <span
                className={
                  'font-plexsans text-main font-medium uppercase text-left-accent'
                }
              >
                Private game
              </span>
              <Popover
                trigger={
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={'hover:opacity-80'}
                  >
                    <g opacity="0.5">
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        fill="#F9F8F4"
                        stroke="#F9F8F4"
                        strokeWidth="0.500035"
                      />
                      <path
                        d="M7.2446 9.95291V7.68144C8.03117 7.64451 8.64508 7.45983 9.08633 7.12742C9.53717 6.79501 9.76259 6.33795 9.76259 5.75623V5.56233C9.76259 5.09141 9.60911 4.71745 9.30216 4.44044C8.9952 4.1542 8.58273 4.01108 8.06475 4.01108C7.50839 4.01108 7.06235 4.16343 6.72662 4.46814C6.40048 4.77285 6.17986 5.16066 6.06475 5.63158L5 5.24377C5.08633 4.94829 5.21103 4.66667 5.3741 4.39889C5.54676 4.12188 5.75779 3.88181 6.00719 3.67867C6.26619 3.4663 6.56835 3.30009 6.91367 3.18006C7.25899 3.06002 7.65707 3 8.10791 3C9 3 9.70504 3.23546 10.223 3.70637C10.741 4.17729 11 4.8144 11 5.61773C11 6.06094 10.9185 6.44875 10.7554 6.78116C10.6019 7.10434 10.4005 7.38135 10.1511 7.61219C9.90168 7.84303 9.61871 8.0277 9.30216 8.1662C8.98561 8.30471 8.66906 8.40166 8.35252 8.45706V9.95291H7.2446ZM7.80576 13C7.4988 13 7.27338 12.9261 7.1295 12.7784C6.9952 12.6307 6.92806 12.4367 6.92806 12.1967V12.0166C6.92806 11.7765 6.9952 11.5826 7.1295 11.4349C7.27338 11.2872 7.4988 11.2133 7.80576 11.2133C8.11271 11.2133 8.33333 11.2872 8.46763 11.4349C8.61151 11.5826 8.68345 11.7765 8.68345 12.0166V12.1967C8.68345 12.4367 8.61151 12.6307 8.46763 12.7784C8.33333 12.9261 8.11271 13 7.80576 13Z"
                        fill="#252525"
                      />
                    </g>
                  </svg>
                }
              >
                <div
                  className={
                    'flex min-w-[250px] flex-col items-center justify-center gap-2 font-plexsans'
                  }
                >
                  <span className={'w-full self-start text-[14px]/[14px]'}>
                    Private game
                  </span>
                  <div
                    className={
                      'w-full text-[12px]/[12px] font-light opacity-70'
                    }
                  >
                    If you want to play with your friend and not run into random
                    players during the game, check the box. After creating a
                    lobby, you can invite you friend to join
                  </div>
                </div>
              </Popover>
            </div>
            <Checkbox
              isSelected={isPrivateGame}
              setIsSelected={setIsPrivateGame}
            />
          </div>
        </div>
        <div className={'flex-grow'} />
        <Button
          label={'Create lobby'}
          onClick={async () => {
            if (checkFieldsValidity()) {
              if (newLobbyName == undefined || participationFee == undefined) {
                console.log(newLobbyName);
                console.log(participationFee);
                console.log('No lobby name or participation fee');
                return;
              }
              await createLobby(newLobbyName, participationFee, isPrivateGame);
              // pvpLobbyStore.setOwnedLobbyId(createdLobbyID);
              // pvpLobbyStore.setOwnedLobbyKey(createdLobbyKey);
              // pvpLobbyStore.setConnectedLobbyId(createdLobbyID);
              // pvpLobbyStore.setConnectedLobbyKey(createdLobbyKey);
              // pvpLobbyStore.setLastLobbyId(createdLobbyID);
              setIsSuccessModalOpen(true);
            }
          }}
        />
        <Modal
          trigger={<></>}
          isOpen={isSuccessModalOpen}
          setIsOpen={() => {
            setIsSuccessModalOpen(false);
            setIsCreationMode(false);
          }}
        >
          <div
            className={
              'flex flex-col items-center justify-center gap-8 px-4 py-6'
            }
          >
            <svg
              width="161"
              height="161"
              viewBox="0 0 161 161"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M80.442 160.884C124.869 160.884 160.884 124.869 160.884 80.442C160.884 36.0151 124.869 0 80.442 0C36.0151 0 0 36.0151 0 80.442C0 124.869 36.0151 160.884 80.442 160.884Z"
                fill="#212121"
              />
              <path
                d="M80.442 149.22C118.427 149.22 149.22 118.427 149.22 80.442C149.22 42.457 118.427 11.6641 80.442 11.6641C42.457 11.6641 11.6641 42.457 11.6641 80.442C11.6641 118.427 42.457 149.22 80.442 149.22Z"
                stroke="#D2FF00"
                strokeWidth="8"
                strokeMiterlimit="10"
              />
              <path
                d="M52.8568 92.7354C56.0407 92.7354 58.6218 82.6978 58.6218 70.3157C58.6218 57.9337 56.0407 47.8961 52.8568 47.8961C49.6729 47.8961 47.0918 57.9337 47.0918 70.3157C47.0918 82.6978 49.6729 92.7354 52.8568 92.7354Z"
                fill="#D2FF00"
              />
              <path
                d="M103.461 92.7354C106.645 92.7354 109.226 82.6978 109.226 70.3157C109.226 57.9337 106.645 47.8961 103.461 47.8961C100.277 47.8961 97.6963 57.9337 97.6963 70.3157C97.6963 82.6978 100.277 92.7354 103.461 92.7354Z"
                fill="#D2FF00"
              />
              <path
                d="M135.489 76.4906H118.194V82.7178H135.489V76.4906Z"
                fill="#D2FF00"
              />
              <path
                d="M38.7647 76.4906H21.4697V82.7178H38.7647V76.4906Z"
                fill="#D2FF00"
              />
              <path
                d="M108.616 109.029C104.26 111.673 94.0101 117.095 79.8623 117.285C65.4748 117.478 54.9435 112.155 50.5391 109.598"
                stroke="#D2FF00"
                strokeWidth="5"
                strokeMiterlimit="10"
              />
            </svg>
            <span className={'text-headline-1'}>
              Lobby successfully created!
            </span>
            <Button
              label={'Close'}
              onClick={() => {
                setIsSuccessModalOpen(false);
                setIsCreationMode(false);
              }}
            />
          </div>
        </Modal>
      </div>
    </motion.div>
  );
};
