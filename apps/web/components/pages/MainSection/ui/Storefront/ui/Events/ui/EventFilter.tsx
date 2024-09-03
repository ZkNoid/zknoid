import { ZkNoidEventType } from '@/lib/platform/game_events';
import { cn } from '@/lib/helpers';

export function EventFilter({
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
    <button
      className={cn(
        'rounded-[0.26vw] border border-foreground px-[0.521vw] py-[0.26vw] text-center font-plexsans text-[0.833vw] text-foreground',

        selected
          ? 'border-left-accent bg-left-accent text-bg-dark'
          : 'cursor-pointer hover:border-left-accent hover:text-left-accent'
      )}
      onClick={() =>
        setTypesSelected(
          typesSelected.includes(eventType)
            ? typesSelected.filter((x) => x != eventType)
            : [...typesSelected, eventType]
        )
      }
    >
      {eventType}
    </button>
  );
}
