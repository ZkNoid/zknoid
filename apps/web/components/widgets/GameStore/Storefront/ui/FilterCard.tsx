import { ZkNoidEventType } from '@/lib/platform/game_events';
import { clsx } from 'clsx';

export default function FilterCard({
  eventType,
  selected,
  typesSelected,
  setTypesSelected,
}: {
  eventType: ZkNoidEventType;
  typesSelected: ZkNoidEventType[];
  setTypesSelected: (types: ZkNoidEventType[]) => void;
  selected?: boolean;
}) {
  return (
    <div
      onClick={() =>
        setTypesSelected(
          typesSelected.includes(eventType)
            ? typesSelected.filter((x) => x != eventType)
            : [...typesSelected, eventType]
        )
      }
      className={clsx(
        'cursor-pointer rounded border p-1 font-plexsans text-[14px]/[21px] lg:text-filtration-buttons',
        selected
          ? 'border-left-accent bg-left-accent text-bg-dark'
          : 'hover:border-left-accent hover:text-left-accent'
      )}
    >
      {eventType}
    </div>
  );
}
