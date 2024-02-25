import { SOCIALS } from "@/constants/socials";
import Link from "next/link";

export const CentralBlock = () => (
    <div className='flex w-[50%] self-end relative text-[24px]'>
        <img src='image/central-block.svg' className='w-full'></img>
        <div className='absolute flex items-center justify-around w-full h-full'>
            <Link href={"https://docs.zknoid.io/docs"} className='flex gap-2'>
                <img src='image/misc/book.svg' />
                Documentation
            </Link>
            <Link href={"https://zknoid.io"} className='flex gap-2'>
                <img src='image/misc/web.svg' />
                About us
            </Link>
            <div className='flex gap-3'>
                {SOCIALS.map(x => <Link href={x.link} key={x.id}><img src={x.image}></img></Link>)}
            </div>
        </div>
    </div>
)