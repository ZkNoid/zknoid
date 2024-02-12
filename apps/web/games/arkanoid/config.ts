import { createZkNoidGameConfig } from "@/lib/createConfig";
import { ArkanoidGameHub, Balances } from "zknoid-chain-dev";

export const arkanoidConfig =
    createZkNoidGameConfig({
        id: 'arkanoid',
        name: 'Arkanoid',
        description: 'Old but gold game. Beat all the bricks and protect the ball from falling',
        image: '/Arkanoid.png',
        runtimeModules: {
            ArkanoidGameHub,
            Balances,
        }
    });
