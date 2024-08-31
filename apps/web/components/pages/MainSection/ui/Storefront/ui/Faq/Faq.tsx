import Link from 'next/link';
import { CONTACTS } from '@/constants/contacts';
import Image from 'next/image';

export default function Faq() {
  return (
    <div className={'flex w-full flex-col'}>
      <span className={'font-museo text-[1.667vw] font-bold text-foreground'}>
        Technical support
      </span>
      <span
        className={
          'mt-[0.781vw] w-1/2 font-plexsans text-[0.833vw] text-foreground'
        }
      >
        If you have any questions or notice any issues with the operation of our
        application, please do not hesitate to contact us. We will be more than
        happy to answer any questions you may have and try our best to solve any
        problems as soon as possible.
      </span>
      <div className={'mt-[2.083vw] flex flex-col gap-[0.781vw]'}>
        <span
          className={'font-museo text-[1.25vw] font-medium text-foreground'}
        >
          Contacts
        </span>
        <div className={'flex flex-row gap-[0.781vw]'}>
          {CONTACTS.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className={
                'group flex flex-row items-center justify-center gap-[0.521vw] rounded-[0.521vw] bg-[#252525] p-[1.563vw] shadow-2xl'
              }
            >
              <Image
                src={item.image}
                alt={'ZkNoid contacts'}
                className={'h-[1.25vw] w-[1.25vw]'}
              />
              <span
                className={
                  'font-plexsans text-[0.833vw] font-medium text-foreground group-hover:text-left-accent'
                }
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
