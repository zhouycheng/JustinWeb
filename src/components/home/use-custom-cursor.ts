"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { isThemeTransitionLocked } from "@/lib/theme/theme";

type CursorState = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
};

type CustomCursorOptions = {
  size?: number;
  ease?: number;
};

const INITIAL_CURSOR_STATE: CursorState = {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 0,
};

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function hasVisibleCursorDelta(current: CursorState, target: CursorState) {
  return (
    Math.abs(current.x - target.x) > 0.18 ||
    Math.abs(current.y - target.y) > 0.18 ||
    Math.abs(current.scale - target.scale) > 0.01 ||
    Math.abs(current.opacity - target.opacity) > 0.01
  );
}

export function useCustomCursor<T extends HTMLElement>(
  stageRef: RefObject<T | null>,
  { size = 220, ease = 0.16 }: CustomCursorOptions = {}
) {
  const frameRef = useRef<number | null>(null);
  const currentRef = useRef<CursorState>({ ...INITIAL_CURSOR_STATE });
  const targetRef = useRef<CursorState>({ ...INITIAL_CURSOR_STATE });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );
    let isActive = false;

    const applyCursorState = () => {
      const current = currentRef.current;

      stage.style.setProperty("--cursor-x", `${current.x.toFixed(3)}px`);
      stage.style.setProperty("--cursor-y", `${current.y.toFixed(3)}px`);
      stage.style.setProperty("--cursor-scale", current.scale.toFixed(3));
      stage.style.setProperty("--cursor-opacity", current.opacity.toFixed(3));
      stage.style.setProperty("--cursor-radius", `${(size / 2).toFixed(3)}px`);
    };

    const animateCursor = () => {
      const current = currentRef.current;
      const target = targetRef.current;

      current.x = lerp(current.x, target.x, ease);
      current.y = lerp(current.y, target.y, ease);
      current.scale = lerp(current.scale, target.scale, ease * 1.25);
      current.opacity = lerp(current.opacity, target.opacity, ease * 1.4);
      stage.classList.toggle("has-custom-cursor", isActive);
      applyCursorState();

      if (hasVisibleCursorDelta(current, target)) {
        frameRef.current = requestAnimationFrame(animateCursor);
        return;
      }

      frameRef.current = null;
    };

    const queueFrame = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(animateCursor);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      if (isThemeTransitionLocked()) {
        return;
      }

      const target = targetRef.current;
      target.x = event.clientX;
      target.y = event.clientY;
      target.opacity = 1;

      queueFrame();
    };

    const handlePointerDown = () => {
      targetRef.current.scale = 0.94;
      queueFrame();
    };

    const handlePointerUp = () => {
      targetRef.current.scale = 1;
      queueFrame();
    };

    const handlePointerLeave = () => {
      if (isThemeTransitionLocked()) {
        return;
      }

      targetRef.current.opacity = 0;
      queueFrame();
    };

    const applyActivation = () => {
      isActive = mediaQuery.matches;
      stage.classList.toggle("has-custom-cursor", isActive);

      if (!isActive) {
        Object.assign(targetRef.current, INITIAL_CURSOR_STATE);
        Object.assign(currentRef.current, INITIAL_CURSOR_STATE);
        applyCursorState();
      }
    };

    applyActivation();
    mediaQuery.addEventListener("change", applyActivation);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      mediaQuery.removeEventListener("change", applyActivation);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      stage.classList.remove("has-custom-cursor");
    };
  }, [ease, size, stageRef]);
}
