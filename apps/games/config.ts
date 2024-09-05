import { createConfig } from "@sdk/lib/createConfig";
import { numberGuessingConfig } from "./number_guessing/config";
import { randzuConfig } from "./randzu/config";
import { arkanoidConfig } from "./arkanoid/config";
import { checkersConfig } from "./checkers/config";

export const zkNoidConfigGlobal2 = createConfig({
  games: [numberGuessingConfig, randzuConfig, arkanoidConfig, checkersConfig],
});
