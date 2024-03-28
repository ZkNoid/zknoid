import Link from 'next/link';
import Image from 'next/image';

export const MobileNavbar = () => {
  return (
    <header className="z-10 flex h-[91px] w-full items-center px-3 lg:hidden lg:px-[50px]">
      <div className={'flex w-full items-center justify-between'}>
        <Link
          href={'/'}
          className={'cursor-pointer ease-in-out hover:opacity-80'}
        >
          <Image
            src={'/image/zknoid-logo.svg'}
            alt={'ZkNoid logo'}
            width={219}
            height={47}
          />
        </Link>
      </div>
    </header>
  );
};
