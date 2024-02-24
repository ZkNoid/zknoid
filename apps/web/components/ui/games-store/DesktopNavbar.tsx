import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/constants/socials";
import { Card } from "./Card";

export const DesktopNavbar = () => {
    return (
        <header className="w-full h-[91px] px-3 lg:px-[50px] items-center flex">
            <div className={'flex w-full items-center justify-between'}>
                <Image
                    src={'/image/zknoid-logo.svg'}
                    alt={'ZkNoid logo'}
                    width={219}
                    height={47}
                />
                <div className="flex text-base gap-5 items-center">
                    <div className="flex flex-col items-end">
                        <div>Deposit: 0.0</div>
                        <div>300.0 Mina</div>
                    </div>
                    <div>
                        <Card image="image/cards/top-up.svg" text="Top up" />
                    </div>

                </div>
                <div className="flex gap-5">
                <Card image="image/cards/account.svg" text="1N4Qbzg6LSXUXyX..." />
                <Card image="image/cards/mina.png" text="Mina network" toggle={true}/>
                
                </div>
            </div>
        </header>
    )
}