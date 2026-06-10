"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

import { useCustomCursor } from "./use-custom-cursor";

type CustomCursorProps = {
  children: ReactNode;
  className?: string;
  activeTargetSelector?: string;
  scrollRootSelector?: string;
};

export function CustomCursor({
  children,
  className,
  activeTargetSelector,
  scrollRootSelector,
}: CustomCursorProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useCustomCursor(stageRef, { activeTargetSelector, scrollRootSelector });

  return (
    <div
      ref={stageRef}
      data-reveal-stage=""
      className={["home-reveal-stage", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
