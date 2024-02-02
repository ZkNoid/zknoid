# ZkNoid

ZkNoid is a ZK gaming platform on [Mina protocol](https://minaprotocol.com/).
It was created on EthGlobal Istnabul by @asimaranov and @aii23 and [won](https://ethglobal.com/showcase/zknoid-nr5ef) Mina 2nd place.

Learn more about ZkNoid on [zknoid.io](https://www.zknoid.io/)
- [Website](https://www.zknoid.io/)
- [Docs](https://docs.zknoid.io/)
- [Blog](https://zknoid.medium.com/)

### Repository

Repository contains ZkNoid game platform monorepo. 
It implements contracts and UI for games such as Arkanoid and Randzu and games store.

### Setup
Project awaits for proto-kit implementation of app network deployment tools to be fully launched publicly.  

Now project can be used localy. Here are the commands for set-up

```bash
git clone https://github.com/ZkNoid/zknoid
cd zknoid
 
# ensures you have the right node js version
nvm use
pnpm install

npm run dev
```

In roadmap it's planned to separate games and game store: games will import platform components and register themselves to be added to the store.


### Interesting places
- Arkanoid game verification – [GameContexts.ts](https://github.com/ZkNoid/zknoid/blob/develop/packages/chain/src/GameContext.ts)

- Matchmaking base contract – [MatchMaker.ts](https://github.com/ZkNoid/zknoid/blob/develop/packages/chain/src/MatchMaker.ts)

- Randzu game multiplayer – [RandzuLogic.ts](https://github.com/ZkNoid/zknoid/blob/develop/packages/chain/src/RandzuLogic.ts)


## Gameplay

[zknoid_gameplay.webm](https://github.com/ZkNoid/zknoid/assets/25568730/2c83bddf-d28a-43fd-abef-145f593b1f57)


Check out [zknoid.io](https://www.zknoid.io/) for more info
