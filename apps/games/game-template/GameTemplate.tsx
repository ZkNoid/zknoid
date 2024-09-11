import { gameTemplateConfig } from "./config";
import GamePage from "@zknoid/sdk/components/framework/GamePage";

export default function GameTemplate() {
  return (
    <GamePage gameConfig={gameTemplateConfig}>
      <section className={"w-full h-screen text-center"}>Game Template</section>
    </GamePage>
  );
}
