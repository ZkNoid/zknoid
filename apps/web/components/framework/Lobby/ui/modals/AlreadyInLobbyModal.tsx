import BaseModal from '@/components/shared/Modal/BaseModal';
import Button from '@/components/shared/Button';

export const AlreadyInLobbyModal = ({
  isOpen,
  setIsOpen,
  leaveLobby,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  leaveLobby: () => Promise<void>;
}) => {
  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        className={
          'flex max-w-[650px] flex-col items-center justify-center gap-4'
        }
      >
        <span
          className={
            'text-center text-headline-1 font-medium uppercase text-left-accent'
          }
        >
          You should leave current lobby first
        </span>
        <span
          className={'max-w-[80%] text-center font-plexsans text-[16px]/[16px]'}
        >
          If you choose &quot;Leave lobby&quot; your automatically disconnect.
          Are you sure you want to disconnect from current lobby?
        </span>
        <div className={'flex w-full flex-row justify-between'}>
          <Button
            label={'Leave lobby'}
            onClick={() => leaveLobby()}
            className={'max-w-[30%]'}
          />
          <Button
            label={'Close'}
            onClick={() => setIsOpen(false)}
            color={'tertiary'}
            className={'max-w-[30%]'}
          />
        </div>
      </div>
    </BaseModal>
  );
};
