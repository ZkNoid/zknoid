import BaseModal from "@/components/shared/Modal/BaseModal";
import {useState} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import catWifeIMG from '@/public/image/games/lottery/cat-wife.svg'
import Image from "next/image";


const NetworkSwitchButton = dynamic(
    () => import('./nonSSR/NetworkSwitchButton'),
    {
        ssr: false,
    }
);

export default function WrongNetworkModal() {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    return (
        <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} isDismissible={false}>
            <div className={'flex flex-col max-w-[20vw]'}>
                <Image src={catWifeIMG} alt={'catWifeImg'} className={'mx-auto w-auto h-[10vw] object-contain object-center'}/>
                <span className={'my-[1vw] font-museo font-medium text-center text-[1vw]'}>This game only supports Devnet network, in order to play you need to switch network</span>
                <div className={'flex flex-col gap-[1vw]'}>
                    <NetworkSwitchButton/>
                    <div className={'flex flex-row items-center'}>
                        <div className={'w-full h-px bg-neutral-500'}/>
                        <span className={'px-[0.5vw] text-[0.5vw]'}>or</span>
                        <div className={'w-full h-px bg-neutral-500'}/>
                    </div>
                    <Link href={'/'} className={'border border-right-accent p-[0.5vw] rounded-[0.26vw] w-full text-[0.833vw] font-museo font-medium text-center hover:bg-right-accent/10'}>Pick another game</Link>
                </div>
            </div>
        </BaseModal>
    )
}