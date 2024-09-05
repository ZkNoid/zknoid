import { motion } from 'framer-motion';
import { useLobbiesStore } from '@/lib/stores/lobbiesStore';
import { useAlreadyInLobbyModalStore } from '@/lib/stores/alreadyInLobbyModalStore';

export const CreateNewLobbyBtn = ({ onClick }: { onClick: () => void }) => {
  const lobbiesStore = useLobbiesStore();
  const alreadyInLobbyModalStore = useAlreadyInLobbyModalStore();
  return (
    <motion.div
      className={'col-start-4 col-end-6 row-span-1 h-full w-full'}
      initial={'hidden'}
      animate={'visible'}
      exit={'hidden'}
      transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
      variants={{
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
      onClick={() => {
        lobbiesStore.currentLobby
          ? alreadyInLobbyModalStore.setIsOpen(true)
          : onClick();
      }}
    >
      <div
        className={
          'flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[5px] border border-foreground bg-bg-dark p-2 hover:bg-[#464646]'
        }
      >
        <span
          className={
            'text-[20px]/[20px] font-medium uppercase text-left-accent'
          }
        >
          Create new lobby
        </span>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="12.7273" width="28" height="2.54545" fill="#D2FF00" />
          <rect
            x="15.2734"
            width="28"
            height="2.54545"
            transform="rotate(90 15.2734 0)"
            fill="#D2FF00"
          />
        </svg>
        <span
          className={
            'text-center font-plexsans text-[12px]/[12px] text-left-accent'
          }
        >
          If you don&apos;t find any of the existing lobbies to your liking, you
          are always welcome to create your own and invite your friends to join
          you there!
        </span>
      </div>
    </motion.div>
  );
};
