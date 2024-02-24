import { SOCIALS } from "@/constants/socials";

export const CentralBlock = () => (
    <div className='flex w-[50%] self-end relative text-[24px]'>
        <img src='image/central-block.svg' className='w-full'></img>
        <div className='absolute flex items-center justify-around w-full h-full'>
            <div className='flex gap-2'>
                <img src='image/misc/book.svg' />
                Documentation
            </div>
            <div className='flex gap-2'>
                <img src='image/misc/web.svg' />
                About us
            </div>
            <div className='flex gap-3'>
                {SOCIALS.map(x => <div><img src={x.image}></img></div>)}
            </div>
        </div>
    </div>
)