import Image from 'next/image';
import Link from 'next/link';
import { CONTACTS } from '@/constants/contacts';
import { Accordion } from '@/components/ui/games-store/shared/Accordion';

export const SupportAndFaq = () => {
  return (
    <div className="top-0 flex h-full w-full flex-col gap-20 p-4 pb-[100px] lg:p-10">
      <div className={'flex max-w-full flex-col gap-5 lg:max-w-[40%]'}>
        <div className="pb-3 text-headline-2 lg:text-headline-1">
          Technical support
        </div>
        <div className="font-plexsans text-[14px]/[18px] lg:text-main">
          If you have any questions or notice any issues with the operation of
          our application, please do not hesitate to contact us. We will be more
          than happy to answer any questions you may have and try our best to
          solve any problems as soon as possible.
        </div>
      </div>
      <div className="flex max-w-full flex-col items-start justify-start lg:max-w-[50%]">
        <span className={'pb-4 text-[20px]/[20px] lg:text-headline-2'}>
          Contacts
        </span>
        <div
          className={
            'grid grid-cols-1 grid-rows-3 gap-4 lg:grid-flow-col lg:grid-cols-2'
          }
        >
          {CONTACTS.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className={'flex flex-row items-start justify-start gap-4'}
            >
              <Image
                src={item.image}
                alt={'ZkNoid contacts'}
                width={30}
                height={30}
              />
              <span className={'font-plexsans text-[20px]/[22px] font-medium'}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className={'hidden flex-col lg:flex'}>
        <div className={'pb-2 text-headline-1'}>FAQ</div>
        <div className={'flex flex-row justify-between gap-5'}>
          <div className={'flex h-fit w-full flex-col gap-4'}>
            {[...Array(5)].map((_value, index) => (
              <Accordion
                title={'The wallet is not connected to the application'}
                defaultOpen={index === 2}
                key={index}
              >
                <span className={'font-plexsans text-main'}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Atque blanditiis ducimus eaque earum et eveniet exercitationem
                  expedita fuga id illo ipsam laboriosam, magni, minus nemo
                  nihil nisi nulla officiis perferendis placeat porro, quaerat
                  quasi quidem saepe soluta ut velit veritatis.
                </span>
              </Accordion>
            ))}
          </div>

          <div className={'flex h-fit w-full flex-col gap-4'}>
            {[...Array(5)].map((_value, index) => (
              <Accordion
                title={'The wallet is not connected to the application'}
                defaultOpen={index === 0}
                key={index}
              >
                <span className={'font-plexsans text-main'}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Atque blanditiis ducimus eaque earum et eveniet exercitationem
                  expedita fuga id illo ipsam laboriosam, magni, minus nemo
                  nihil nisi nulla officiis perferendis placeat porro, quaerat
                  quasi quidem saepe soluta ut velit veritatis.
                </span>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
