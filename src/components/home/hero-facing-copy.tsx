import type { HeroFacingContent, HeroFacingVariant } from "@/lib/site/content";

type HeroFacingCopyProps = {
  content: HeroFacingContent;
  variant: HeroFacingVariant;
};

export function HeroFacingCopy({ content, variant }: HeroFacingCopyProps) {
  const isReveal = variant === "reveal";

  return (
    <div className={["hero-pointer-copy", isReveal ? "hero-pointer-copy--reveal" : ""].join(" ")}>
      <h1
        className={[
          "hero-pointer-title hero-title-balance font-home-mono text-[60px] leading-[0.98] md:text-[76px] xl:text-[86px]",
          isReveal ? "hero-pointer-title--reveal" : "hero-pointer-title--primary",
        ].join(" ")}
      >
        <span className={isReveal ? "font-semibold" : "font-bold"}>{content.leading}</span>
        <span
          className={[
            isReveal ? "hero-pointer-title-accent--reveal" : "hero-pointer-title-accent--primary",
            "font-medium",
          ].join(" ")}
        >
          {content.accent}
        </span>
      </h1>

      <p
        className={[
          "hero-pointer-subtitle mt-6 font-home-mono text-[18px] font-normal tracking-[-0.035em] md:text-[22px] xl:text-[24px]",
          isReveal ? "hero-pointer-subtitle--reveal" : "hero-pointer-subtitle--primary",
        ].join(" ")}
      >
        {content.subtitle}
      </p>
    </div>
  );
}
