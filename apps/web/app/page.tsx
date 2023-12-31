import { Footer } from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { games } from './constants/games'

export default function Home() {
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
        <div className='grid grid-cols-2 gap-5 py-10'>
          {games.map(game => (
            game.active ? (
              <div className='p-10 rounded-xl bg-white bg-gradient-to-b from-zinc-100' key={game.type}>
                <Link className='flex gap-5 flex-col m-5 h-full' href={`/games/${game.type}/global`}>
                  <Image src={game.logo} alt='Game logo' width={220} height={251} />
                  <div className='text-xl'>{game.name}</div>
                  <div className='text-base w-36'>{game.description}</div>
                </Link>
              </div>
            ) : (
              <div className='p-10 rounded-xl bg-gray-100 bg-gradient-to-b from-gray-200' key={game.type}>
                <div className='flex gap-5 flex-col m-5 h-full cursor-default'>
                  <Image src={game.logo} alt='Game logo' width={220} height={251} />
                  <div className='text-xl'>{game.name}</div>
                  <div className='text-base w-36'>{game.description}</div>
                  <div className='text-xl w-full text-center flex items-center justify-center'>Coming soon</div>
                </div>
              </div>
            )
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
