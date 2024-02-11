import { createZkNoidGameConfig } from "@/lib/createConfig";
import { ArkanoidGameHub, Balances } from "zknoid-chain-dev";

export const arkanoidConfig =
    createZkNoidGameConfig({
        id: 'arkanoid',
        name: 'Arkanoid',
        description: 'Arkanoid game',
        runtimeModules: {
            ArkanoidGameHub,
            Balances,
        }
    });
