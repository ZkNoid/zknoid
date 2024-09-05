import {
  useEventTimer,
  ZkNoidEvent,
  ZkNoidEventType,
} from '@/lib/platform/game_events';
import Link from 'next/link';
import Image from 'next/image';

export function EventItem({
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
      className={'group relative rounded-[0.26vw] border border-left-accent'}
    >
      {image && (
        <div className={'h-full w-full'}>
          <Image
            src={image}
            width={486}
            height={301}
            alt={'Event image'}
            className={
              'h-[15.625vw] w-full object-contain object-right 2xl:block'
            }
          />
        </div>
      )}
      <div
        className={
          'absolute left-0 top-0 mr-auto flex h-full flex-col justify-between p-[1.042vw]'
        }
      >
        <div className={'flex flex-col gap-[0.521vw]'}>
          <span
            className={'font-museo text-[1.25vw] font-bold text-foreground'}
          >
            {headText}
          </span>
          <span className={'font-plexsans text-[0.833vw] text-foreground'}>
            {description}
          </span>
        </div>
        <div className={'font-museo text-[1.563vw] font-medium'}>
          {eventCounter.type == ZkNoidEventType.UPCOMING_EVENTS && (
            <>START IN {time}</>
          )}
          {eventCounter.type == ZkNoidEventType.CURRENT_EVENTS && (
            <>END IN {time}</>
          )}
        </div>
      </div>
      <div
        className={
          'absolute -bottom-[1px] -right-[1px] z-[1] flex items-center justify-center rounded-tl-[0.26vw] border-l border-t border-left-accent bg-bg-grey pl-[0.365vw] pt-[0.365vw]'
        }
      >
        <div
          className={
            'flex h-[3.646vw] w-[3.646vw] items-center justify-center rounded-[0.26vw] border border-left-accent group-hover:bg-left-accent'
          }
        >
          <svg
            width="27"
            height="45"
            viewBox="0 0 27 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={'h-[2.083vw] w-[1.042vw]'}
          >
            <path
              d="M2.7998 2.7334L22.6331 22.5667L2.7998 42.4001"
              stroke="#D2FF00"
              stroke-width="5.66667"
              className={'group-hover:stroke-bg-grey'}
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
