"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

import { useCustomCursor } from "./use-custom-cursor";

type CustomCursorProps = {
  children: ReactNode;
};

export function CustomCursor({ children }: CustomCursorProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useCustomCursor(stageRef);

  return (
    <div ref={stageRef} data-reveal-stage="" className="home-reveal-stage">
      {children}
    </div>
  );
}
