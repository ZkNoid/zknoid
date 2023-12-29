import { Footer } from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

interface IGame {
  logo: string;
  name: string;
  description: string;
}

export default function Home() {
  const games: IGame[] = [
    {
      logo: '/Arkanoid.png',
      name: 'Arcanoid game',
      description: 'Old but gold game. Beat all the bricks and protect the ball from falling'
    }
  ]
  return (
    <>
      <main className="flex min-h-screen flex-col items-center px-24 py-10">
        <div className='z-10 max-w-5xl w-full items-center justify-between text-sm flex'>
          <div className='fixed left-0 top-0 flex w-full justify-around border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl'>
            <div className='flex basis-6/12 text-xl flex-row px-4'>ZkNoid<div className='text-sm pl-4 pt-2'>the bot free gaming</div></div>
            <div className='flex justify-end basis-6/12 text-xl flex-row px-8'>
              <a href="https://docs.zknoid.io/">Docs</a>
            </div>
          </div>
        </div>
        <div className='bg-white p-10 rounded-xl border-gray-300 bg-gradient-to-b from-zinc-200'>
          Always wondering how many bots and cheaters are in the game you want to try? <br />
          <div><div className='font-bold inline'>- No more cheating or bots allowed</div> (c) ZK proof</div> <br />
          Nobody belives in your speedrun results? <br />
          <div><div className='font-bold inline'>- Proofs can't be tricked</div> (c) ZK proof verifier</div>
        </div>
        <div className='grid py-10'>
        {games.map(game => (
          <div className='bg-white p-10 rounded-xl border-gray-200 bg-gradient-to-b from-zinc-100'>
            <Link className='flex gap-5 flex-col m-5' href={'/arkanoid/global'}>
              <Image src={game.logo} alt='Game logo' width={220} height={251} />
              <div className='text-xl'>{game.name}</div>
              <div className='text-base w-36'>{game.description}</div>
            </Link>
          </div>
        ))}
        </div>
        
      </main>
      <Footer />
    </>
  )
}
