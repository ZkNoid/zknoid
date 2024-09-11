import { createZkNoidGameConfig } from "@zknoid/sdk/lib/createConfig";
import { ZkNoidGameType } from "@zknoid/sdk/lib/platform/game_types";
import { LogoMode } from "@zknoid/sdk/constants/games";
import {
  ZkNoidGameFeature,
  ZkNoidGameGenre,
} from "@zknoid/sdk/lib/platform/game_tags";
import GameTemplate from "./GameTemplate";

const description = "Template description";
const rules = "Template rules";

export const gameTemplateConfig = createZkNoidGameConfig({
  id: "game-template",
  type: ZkNoidGameType.SinglePlayer,
  name: "Game Template",
  description: description,
  image: "/image/games/soon.svg",
  logoMode: LogoMode.CENTER,
  genre: ZkNoidGameGenre.BoardGames,
  features: [ZkNoidGameFeature.SinglePlayer],
  isReleased: true,
  releaseDate: new Date(2000, 1, 1),
  popularity: 0,
  author: "ZkNoid Team",
  rules: rules,
  runtimeModules: {},
  page: GameTemplate,
});
