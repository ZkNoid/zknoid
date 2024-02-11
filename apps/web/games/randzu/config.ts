import { createZkNoidGameConfig } from "@/lib/createConfig";
import { RandzuLogic } from "zknoid-chain-dev";

export const randzuConfig =
    createZkNoidGameConfig({
        id: 'randzu',
        name: 'Randzu',
        description: 'Randzu game',
        runtimeModules: {
            RandzuLogic
        }
});
