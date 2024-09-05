import {
  ALL_GAME_FEATURES,
  ALL_GAME_GENRES,
  ZkNoidGameFeature,
  ZkNoidGameGenre,
} from '@/lib/platform/game_tags';
import { ZkNoidEventType } from '@/lib/platform/game_events';
import { AnimatePresence, motion } from 'framer-motion';
import { GameStoreFilter } from './ui/GameStoreFilter';

export default function GameStoreFilters({
  genresSelected,
  setGenresSelected,
  featuresSelected,
  setFeaturesSelected,
  eventTypesSelected,
  setEventTypesSelected,
}: {
  genresSelected: ZkNoidGameGenre[];
  setGenresSelected: (genresSelected: ZkNoidGameGenre[]) => void;
  featuresSelected: ZkNoidGameFeature[];
  setFeaturesSelected: (featuresSelected: ZkNoidGameFeature[]) => void;
  eventTypesSelected: ZkNoidEventType[];
  setEventTypesSelected: (eventTypesSelected: ZkNoidEventType[]) => void;
}) {
  return (
    <div className={'flex w-1/3 flex-col gap-[1.042vw]'}>
      <span className={'font-museo text-[1.25vw] font-bold'}>Filtration</span>
      <GameStoreFilter
        key={0}
        defaultExpanded={true}
        title="Genre"
        items={ALL_GAME_GENRES}
        itemsSelected={genresSelected}
        setItemsSelected={setGenresSelected}
      />
      <GameStoreFilter
        key={1}
        defaultExpanded={false}
        title="Features"
        items={ALL_GAME_FEATURES}
        itemsSelected={featuresSelected}
        setItemsSelected={setFeaturesSelected}
      />
      <AnimatePresence initial={false} mode={'wait'}>
        {genresSelected.length != 0 ||
        featuresSelected.length != 0 ||
        eventTypesSelected.length != 0 ? (
          <motion.div
            className={
              'cursor-pointer rounded-[0.26vw] border border-left-accent bg-left-accent py-[0.26vw] text-center font-museo text-[1.042vw] font-medium text-bg-dark hover:bg-bg-grey hover:text-left-accent'
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setGenresSelected([]);
              setFeaturesSelected([]);
              setEventTypesSelected([]);
            }}
          >
            Reset filters
          </motion.div>
        ) : undefined}
      </AnimatePresence>
    </div>
  );
}
