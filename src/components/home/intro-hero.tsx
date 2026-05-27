"use client";

import type { HeroFacingContent, HeroFacingVariant } from "@/lib/site/content";

import { HeroFacingCopy } from "./hero-facing-copy";
import { usePointerFacingEffect } from "./use-pointer-facing-effect";

type IntroHeroProps = {
  content: HeroFacingContent;
  variant: HeroFacingVariant;
  enableMotionSensor?: boolean;
};

export function IntroHero({ content, variant, enableMotionSensor = false }: IntroHeroProps) {
  const motionSensorRef = usePointerFacingEffect<HTMLDivElement>({
    enabled: enableMotionSensor,
  });

  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-24 pt-28 md:px-10 md:pb-28 md:pt-32">
      <div className="hero-pointer-stage flex max-w-5xl flex-col items-center text-center">
        <div
          ref={enableMotionSensor ? motionSensorRef : undefined}
          className="hero-pointer-sensor"
        >
          <HeroFacingCopy content={content} variant={variant} />
        </div>
      </div>
    </section>
  );
}
