import {
  useEventTimer,
  ZkNoidEvent,
  ZkNoidEventType,
} from '@/lib/platform/game_events';
import Image from 'next/image';
import eventBoxBorderImg from '@/public/image/section2/event-box-border.svg';
import Link from 'next/link';

export default function EventCard({
  headText,
  description,
  event,
  image,
}: {
  headText: string;
  description: string;
  event: ZkNoidEvent;
  image?: string;
}) {
  const eventCounter = useEventTimer(event);
  const time = eventCounter.startsIn
    ? `${eventCounter.startsIn.days}d ${
        eventCounter.startsIn.hours
      }:${eventCounter.startsIn.minutes}:${Math.trunc(
        eventCounter.startsIn.seconds!
      )}`
    : '';

  return (
    <Link
      href={event.link}
      className="relative flex cursor-pointer flex-col border-left-accent"
    >
      {image && (
        <div className="masked-event-card absolute hidden h-full w-full 2xl:block">
          <Image
            src={image}
            width={486}
            height={301}
            alt=""
            className="absolute bottom-0 right-0"
          />
        </div>
      )}
      <Image src={eventBoxBorderImg} alt="" className="z-[5] w-full lg:block" />
      <div className={'group absolute bottom-[0.1vw] right-[0.0vw] z-[5]'}>
        <svg
          width="68"
          height="69"
          viewBox="0 0 68 69"
          fill="none"
          className="h-[7vw] w-[7vw] lg:h-[4.25vw] lg:w-[4.25vw]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="1.08594"
            width="67"
            height="67"
            rx="4.5"
            fill="#212121"
            stroke="#D2FF00"
          />
          <path
            d="M23.7998 15.3193L43.6331 35.1527L23.7998 54.986"
            stroke="#D2FF00"
            strokeWidth="5.66667"
          />
        </svg>
      </div>
      <div className="absolute left-0 top-0 flex h-full w-full flex-col p-2 lg:p-5">
        <div className="pb-2 text-[20px]/[20px] font-bold lg:text-headline-2">
          {headText}
        </div>
        <div className="max-w-full font-plexsans text-[14px]/[18px] lg:max-w-[462px] lg:text-main">
          {description}
        </div>
        <div className="mt-auto max-w-full pb-0 text-[4vw] font-medium lg:max-w-[462px] lg:text-[20px]/[20px] lg:text-big-uppercase">
          {eventCounter.type == ZkNoidEventType.UPCOMING_EVENTS && (
            <>START IN {time}</>
          )}
          {eventCounter.type == ZkNoidEventType.CURRENT_EVENTS && (
            <>END IN {time}</>
          )}
        </div>
      </div>
    </Link>
  );
}
