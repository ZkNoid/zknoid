import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className='z-10 max-w-5xl w-full items-center justify-between text-sm flex'>
        <div className='fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit'>
          <div className='flex text-xl flex-column items-center'>ZkNoid<div className='text-sm pl-4 pt-2'>the bot free gaming</div></div>
        </div>

      </div>
      <div className='bg-white p-10 rounded-xl border-gray-300 bg-gradient-to-b from-zinc-200'>
        Always wondering how many bots and cheaters are in the game you want to try? <br />
        <div><div className='font-bold inline'>- No more cheating or bots allowed</div> (c) ZK proof</div>
      </div>
      <div className='bg-white p-10 rounded-xl border-gray-300 bg-gradient-to-b from-zinc-200'>

        <Link className='flex gap-5 flex-col m-5' href={'/arkanoid'}>
          <Image src={'/Arkanoid.png'} alt='Akranoid' width={220} height={251}></Image>
          <div className='text-xl'>Arcanoid game</div>
          <div className='text-base w-36'>Old but gold game. Beat all the bricks and protect the ball from falling</div>
        </Link>
      </div>

    </main>
  )
}
