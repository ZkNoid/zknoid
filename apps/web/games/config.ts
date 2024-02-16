import { createConfig } from "@/lib/createConfig";
import { arkanoidConfig } from "./arkanoid/config";
import { randzuConfig } from "./randzu/config";

export const zkNoidConfig = createConfig({
    games: [
        arkanoidConfig,
        randzuConfig
    ]
})
