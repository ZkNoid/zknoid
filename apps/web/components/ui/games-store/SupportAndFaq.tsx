import Image from 'next/image';
import Link from 'next/link';
import { CONTACTS } from '@/constants/contacts';
import { Accordion } from '@/components/ui/games-store/shared/ui/Accordion';

export const SupportAndFaq = () => {
  return (
    <div className="top-0 flex h-full w-full flex-col gap-20 p-10">
      <div className={'flex max-w-[40%] flex-col gap-3'}>
        <div className="text-headline-1">Technical support</div>
        <div className="text-main font-plexsans">
          If you have any questions or notice any issues with the operation of
          our application, please do not hesitate to contact us. We will be more
          than happy to answer any questions you may have and try our best to
          solve any problems as soon as possible.
        </div>
      </div>
      <div className="flex max-w-[50%] flex-col items-start justify-start">
        <span className={'text-headline-2 pb-4'}>Contacts</span>
        <div className={'grid grid-flow-col grid-cols-2 grid-rows-3 gap-4'}>
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
      <div className={'flex flex-col'}>
        <div className={'text-headline-1 pb-2'}>FAQ</div>
        <div className={'flex flex-row justify-between'}>
          <div className={'flex w-full flex-col gap-4'}>
            <Accordion title={'Some Title'} defaultOpen>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>
          </div>
          <div className={'flex w-full flex-col gap-4'}>
            <Accordion title={'Some Title'} defaultOpen>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>

            <Accordion title={'Some Title'}>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                blanditiis ducimus eaque earum et eveniet exercitationem
                expedita fuga id illo ipsam laboriosam, magni, minus nemo nihil
                nisi nulla officiis perferendis placeat porro, quaerat quasi
                quidem saepe soluta ut velit veritatis.
              </span>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};
