type DotGridBackgroundProps = {
  variant?: "primary" | "reveal";
};

export function DotGridBackground({ variant = "primary" }: DotGridBackgroundProps) {
  const isReveal = variant === "reveal";
  const variantClass = isReveal ? "dot-grid-variant--reveal" : "dot-grid-variant--primary";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={["dot-grid-backdrop-stack absolute inset-0", variantClass].join(" ")}>
        <div className="dot-grid-backdrop dot-grid-backdrop--light" />
        <div className="dot-grid-backdrop dot-grid-backdrop--dark" />
      </div>

      <div className={["dot-grid-motion-plane absolute inset-0", variantClass].join(" ")}>
        <div className="dot-grid-theme-stack absolute inset-0">
          <div className="dot-grid-theme-layer dot-grid-theme-layer--light" />
          <div className="dot-grid-theme-layer dot-grid-theme-layer--dark" />
        </div>
      </div>
    </div>
  );
}
