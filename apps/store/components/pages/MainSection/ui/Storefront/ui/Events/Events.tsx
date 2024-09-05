import {
  ALL_GAME_EVENT_TYPES,
  GAME_EVENTS,
  getEventType,
  ZkNoidEventType,
} from '@/lib/platform/game_events';
import Lottie from 'react-lottie';
import SnakeNoEvents from '@/components/pages/MainSection/ui/Storefront/ui/Favorites/assets/ZKNoid_Snake_Intro_03_05.json';
import { EventFilter } from './ui/EventFilter';
import { EventItem } from './ui/EventItem';

export default function Events({
  eventTypesSelected,
  setEventTypesSelected,
}: {
  eventTypesSelected: ZkNoidEventType[];
  setEventTypesSelected: (eventTypes: ZkNoidEventType[]) => void;
}) {
  const filteredEvents = GAME_EVENTS.filter(
    (x) =>
      (eventTypesSelected.includes(getEventType(x)) ||
        eventTypesSelected.length == 0) &&
      x.eventEnds > Date.now()
  );

  return (
    <div id={'events'} className="flex flex-col gap-[0.833vw]">
      <span className={'font-museo text-[1.667vw] font-bold text-foreground'}>
        Events & Competitions
      </span>
      <div className={'flex flex-row gap-[0.781vw]'}>
        {ALL_GAME_EVENT_TYPES.map((eventType) => (
          <EventFilter
            key={eventType}
            eventType={eventType}
            typesSelected={eventTypesSelected}
            setTypesSelected={setEventTypesSelected}
            selected={eventTypesSelected.includes(eventType)}
          />
        ))}
      </div>
      {filteredEvents.length == 0 && (
        <div className="h-[352px] w-fit">
          <Lottie
            options={{
              animationData: SnakeNoEvents,
              rendererSettings: {
                className: 'z-0 h-full',
              },
            }}
          ></Lottie>
        </div>
      )}
      {filteredEvents.length > 0 && (
        <div className={'grid w-full grid-cols-1 lg:grid-cols-2'}>
          {filteredEvents.map((event) => (
            <EventItem
              key={event.name}
              headText={event.name}
              description={event.description}
              event={event}
              image={event.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}
