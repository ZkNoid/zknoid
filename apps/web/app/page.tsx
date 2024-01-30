import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { games } from './constants/games';

export default function Home() {
  return (
    <>
      <main className="mt-20 flex min-h-screen flex-col items-center px-24 py-10">
        <div className="z-10 flex w-full max-w-5xl items-center justify-between text-sm">
          <div className="fixed left-0 top-0 flex w-full justify-around border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl">
            <div className="flex basis-6/12 flex-row px-4 text-xl">
              ZkNoid<div className="pl-4 pt-2 text-sm">the bot free gaming</div>
            </div>
            <div className="flex basis-6/12 flex-row justify-end px-8 text-xl">
              <a href="https://docs.zknoid.io/">Docs</a>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-gray-300 bg-white bg-gradient-to-b from-zinc-200 p-10">
          Always wondering how many bots and cheaters are in the game you want
          to try? <br />
          <div>
            <div className="inline font-bold">
              - No more cheating or bots allowed
            </div>{' '}
            (c) ZK proof
          </div>{' '}
          <br />
          Nobody belives in your speedrun results? <br />
          <div>
            <div className="inline font-bold">- Proofs can't be tricked</div>{' '}
            (c) ZK proof verifier
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 py-10">
          {games.map((game) =>
            game.active ? (
              <div
                className="rounded-xl bg-white bg-gradient-to-b from-zinc-100 p-10"
                key={game.type}
              >
                <Link
                  className="m-5 flex h-full flex-col gap-5"
                  href={`/games/${game.type}/${game.defaultPage}`}
                >
                  <Image
                    src={game.logo}
                    alt="Game logo"
                    width={220}
                    height={251}
                  />
                  <div className="text-xl">{game.name}</div>
                  <div className="w-36 text-base">{game.description}</div>
                </Link>
              </div>
            ) : (
              <div
                className="rounded-xl bg-gray-100 bg-gradient-to-b from-gray-200 p-10"
                key={game.type}
              >
                <div className="m-5 flex h-full cursor-default flex-col gap-5">
                  <Image
                    src={game.logo}
                    alt="Game logo"
                    width={220}
                    height={251}
                  />
                  <div className="text-xl">{game.name}</div>
                  <div className="w-36 text-base">{game.description}</div>
                  <div className="flex w-full items-center justify-center text-center text-xl">
                    Coming soon
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
