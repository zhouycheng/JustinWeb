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

type PointerPosition = {
  x: number;
  y: number;
};

type CustomCursorOptions = {
  size?: number;
  ease?: number;
  activeTargetSelector?: string;
  scrollRootSelector?: string;
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

function isPointerWithinElement(pointer: PointerPosition, element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return (
    pointer.x >= rect.left &&
    pointer.x <= rect.right &&
    pointer.y >= rect.top &&
    pointer.y <= rect.bottom
  );
}

export function useCustomCursor<T extends HTMLElement>(
  stageRef: RefObject<T | null>,
  {
    size = 220,
    ease = 0.16,
    activeTargetSelector,
    scrollRootSelector,
  }: CustomCursorOptions = {}
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
    const scrollRoot = scrollRootSelector
      ? document.querySelector<HTMLElement>(scrollRootSelector)
      : stage.closest<HTMLElement>(".snap-container");
    let supportsCustomCursor = false;
    let isActive = false;
    let lastPointer: PointerPosition | null = null;

    const applyCursorState = () => {
      const current = currentRef.current;

      stage.style.setProperty("--cursor-x", `${current.x.toFixed(3)}px`);
      stage.style.setProperty("--cursor-y", `${current.y.toFixed(3)}px`);
      stage.style.setProperty("--cursor-scale", current.scale.toFixed(3));
      stage.style.setProperty("--cursor-opacity", current.opacity.toFixed(3));
      stage.style.setProperty("--cursor-radius", `${(size / 2).toFixed(3)}px`);
    };

    const getActiveTarget = () => {
      if (!activeTargetSelector) {
        return null;
      }

      return stage.querySelector<HTMLElement>(activeTargetSelector);
    };

    const shouldActivateCursor = () => {
      if (!supportsCustomCursor) {
        return false;
      }

      if (!activeTargetSelector) {
        return true;
      }

      const activeTarget = getActiveTarget();
      return Boolean(
        lastPointer &&
          activeTarget &&
          isPointerWithinElement(lastPointer, activeTarget)
      );
    };

    const updateCursorTarget = (pointer: PointerPosition, opacity: number) => {
      const stageRect = stage.getBoundingClientRect();
      const target = targetRef.current;

      target.x = pointer.x - stageRect.left;
      target.y = pointer.y - stageRect.top;
      target.opacity = opacity;
    };

    const resetCursorState = (immediate: boolean) => {
      Object.assign(targetRef.current, INITIAL_CURSOR_STATE);

      if (immediate) {
        Object.assign(currentRef.current, INITIAL_CURSOR_STATE);
        applyCursorState();
        return;
      }

      queueFrame();
    };

    const activateCursor = () => {
      isActive = true;
      stage.classList.add("has-custom-cursor");

      if (lastPointer) {
        updateCursorTarget(lastPointer, 1);
      }

      queueFrame();
    };

    const deactivateCursor = (immediate: boolean) => {
      isActive = false;
      stage.classList.remove("has-custom-cursor");
      resetCursorState(immediate);
    };

    const refreshActivation = (immediateReset = true) => {
      if (shouldActivateCursor()) {
        activateCursor();
        return true;
      }

      deactivateCursor(immediateReset);
      return false;
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

      lastPointer = {
        x: event.clientX,
        y: event.clientY,
      };

      if (isThemeTransitionLocked()) {
        return;
      }

      refreshActivation();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      lastPointer = {
        x: event.clientX,
        y: event.clientY,
      };

      if (!refreshActivation()) {
        return;
      }

      targetRef.current.scale = 0.94;
      queueFrame();
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      lastPointer = {
        x: event.clientX,
        y: event.clientY,
      };

      if (!refreshActivation()) {
        return;
      }

      targetRef.current.scale = 1;
      queueFrame();
    };

    const handlePointerLeave = () => {
      if (isThemeTransitionLocked()) {
        return;
      }

      lastPointer = null;
      deactivateCursor(false);
    };

    const handleViewportChange = () => {
      refreshActivation();
    };

    const applyActivation = () => {
      supportsCustomCursor = mediaQuery.matches;

      if (!supportsCustomCursor) {
        deactivateCursor(true);
        return;
      }

      refreshActivation();
    };

    applyActivation();
    mediaQuery.addEventListener("change", applyActivation);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    window.addEventListener("resize", handleViewportChange, { passive: true });

    if (scrollRoot) {
      scrollRoot.addEventListener("scroll", handleViewportChange, { passive: true });
    } else {
      window.addEventListener("scroll", handleViewportChange, { passive: true });
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      window.removeEventListener("resize", handleViewportChange);

      if (scrollRoot) {
        scrollRoot.removeEventListener("scroll", handleViewportChange);
      } else {
        window.removeEventListener("scroll", handleViewportChange);
      }

      mediaQuery.removeEventListener("change", applyActivation);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      stage.classList.remove("has-custom-cursor");
    };
  }, [activeTargetSelector, ease, scrollRootSelector, size, stageRef]);
}
