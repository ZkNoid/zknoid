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

### Deployments
- Develop branch in deployed to https://dev.zknoid.io/
- Main branch in deployed to https://app.zknoid.io/

### Setup
Project can be used localy. Here are the commands for set-up

```bash
git clone https://github.com/ZkNoid/zknoid
cd zknoid
 
# ensures you have the right node js version
# !important! Without this step the app may not work!
# If nvm is not installed please install it. 
# `nvm install` may be needed to install correct node version
nvm use

pnpm install

npm run dev
```

### Implementing your own game
ZkNoid is a modular platform that makes it easy to implement you own game using platform infrastructure. 
To build a game you need to create a game folder inside [apps/web/games](https://github.com/ZkNoid/zknoid/tree/develop/apps/web/games).
Define game config and implement front-end and contracts part in [packages/chain/src/](https://github.com/ZkNoid/zknoid/blob/develop/packages/chain/src/)

- Learn more about SDK [here](https://docs.zknoid.io/docs/sdk)
- Learn more about your game implementation [here](https://docs.zknoid.io/docs/game_building)


### Interesting places
- Arkanoid game verification – [arkanoid/GameContexts.ts](https://github.com/ZkNoid/zknoid/blob/develop/packages/chain/src/arkanoid/GameContext.ts)
- Competitions and leaderboard system [engine/GameHub.ts](https://github.com/ZkNoid/zknoid/blob/develop/packages/chain/src/engine/GameHub.ts)
- Matchmaking system – [engine/MatchMaker.ts](https://github.com/ZkNoid/zknoid/blob/develop/packages/chain/src/engine/MatchMaker.ts)
- Randzu logic implementation – [randzu/RandzuLogic.ts](https://github.com/ZkNoid/zknoid/blob/develop/packages/chain/src/randzu/RandzuLogic.ts)
- Games frontend implementation [apps/web/games](https://github.com/ZkNoid/zknoid/tree/develop/apps/web/games)
- Games contracts implementation [packages/chain/src/](https://github.com/ZkNoid/zknoid/blob/develop/packages/chain/src/)

## Gameplay

[zknoid_gameplay.webm](https://github.com/ZkNoid/zknoid/assets/25568730/2c83bddf-d28a-43fd-abef-145f593b1f57)


Check out [zknoid.io](https://www.zknoid.io/) for more info
