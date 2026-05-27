import type { HeroFacingContent, HeroFacingVariant } from "@/lib/site/content";

import { CustomCursor } from "./custom-cursor";
import { DotGridBackground } from "./dot-grid-background";
import { IntroHero } from "./intro-hero";

type HomeRevealStageProps = {
  hero: Record<HeroFacingVariant, HeroFacingContent>;
};

export function HomeRevealStage({ hero }: HomeRevealStageProps) {
  return (
    <CustomCursor>
      <div className="home-scene-layer home-scene-layer--base">
        <DotGridBackground variant="primary" />
        <IntroHero content={hero.primary} variant="primary" enableMotionSensor />
      </div>

      <div aria-hidden="true" className="home-scene-layer home-scene-layer--reveal">
        <DotGridBackground variant="reveal" />
        <IntroHero content={hero.reveal} variant="reveal" />
      </div>
    </CustomCursor>
  );
}
