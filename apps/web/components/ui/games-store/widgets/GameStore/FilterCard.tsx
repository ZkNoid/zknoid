import { ZkNoidEventType } from '@/lib/platform/game_events';

export const FilterCard = ({
  eventType,
  selected,
  typesSelected,
  setTypesSelected,
}: {
  eventType: ZkNoidEventType;
  typesSelected: ZkNoidEventType[];
  setTypesSelected: (types: ZkNoidEventType[]) => void;
  selected?: boolean;
}) => (
  <div
    onClick={() =>
      setTypesSelected(
        typesSelected.includes(eventType)
          ? typesSelected.filter((x) => x != eventType)
          : [...typesSelected, eventType]
      )
    }
    className={`cursor-pointer rounded border p-1 text-[16px] ${
      selected
        ? 'border-left-accent bg-left-accent text-bg-dark'
        : 'border-[#F9F8F4]'
    }`}
  >
    {eventType}
  </div>
);
