"use client";

import { useEffect, useRef } from "react";

import { isThemeTransitionLocked } from "@/lib/theme/theme";

type MotionValues = {
  rotateX: number;
  rotateY: number;
  shiftX: number;
  shiftY: number;
};

type PointerFacingEffectOptions = {
  enabled?: boolean;
  maxRotateX?: number;
  maxRotateY?: number;
  maxShiftX?: number;
  maxShiftY?: number;
  scopeSelector?: string;
};

type ElementMetrics = {
  centerX: number;
  centerY: number;
  halfWidth: number;
  halfHeight: number;
};

const ZERO_MOTION: MotionValues = {
  rotateX: 0,
  rotateY: 0,
  shiftX: 0,
  shiftY: 0,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function createZeroMotion(): MotionValues {
  return { ...ZERO_MOTION };
}

function createEmptyMetrics(): ElementMetrics {
  return {
    centerX: 0,
    centerY: 0,
    halfWidth: 1,
    halfHeight: 1,
  };
}

function hasVisibleDelta(current: MotionValues, target: MotionValues) {
  return (
    Math.abs(current.rotateX - target.rotateX) > 0.05 ||
    Math.abs(current.rotateY - target.rotateY) > 0.05 ||
    Math.abs(current.shiftX - target.shiftX) > 0.08 ||
    Math.abs(current.shiftY - target.shiftY) > 0.08
  );
}

function applyMotionValues(element: HTMLElement, motion: MotionValues) {
  element.style.setProperty("--hero-rotate-x", `${motion.rotateX.toFixed(3)}deg`);
  element.style.setProperty("--hero-rotate-y", `${motion.rotateY.toFixed(3)}deg`);
  element.style.setProperty("--hero-shift-x", `${motion.shiftX.toFixed(3)}px`);
  element.style.setProperty("--hero-shift-y", `${motion.shiftY.toFixed(3)}px`);
}

export function usePointerFacingEffect<T extends HTMLElement>({
  enabled = true,
  maxRotateX = 11,
  maxRotateY = 15,
  maxShiftX = 22,
  maxShiftY = 14,
  scopeSelector = "[data-reveal-stage]",
}: PointerFacingEffectOptions = {}) {
  const elementRef = useRef<T | null>(null);
  const frameRef = useRef<number | null>(null);
  const metricsFrameRef = useRef<number | null>(null);
  const currentMotionRef = useRef<MotionValues>(createZeroMotion());
  const targetMotionRef = useRef<MotionValues>(createZeroMotion());
  const metricsRef = useRef<ElementMetrics>(createEmptyMetrics());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    if (!mediaQuery.matches) {
      return;
    }

    const syncMetrics = () => {
      const element = elementRef.current;
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      metricsRef.current = {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        halfWidth: Math.max(rect.width / 2, 1),
        halfHeight: Math.max(rect.height / 2, 1),
      };
    };

    const getScopeElement = () => {
      const element = elementRef.current;
      if (!element) {
        return null;
      }

      return element.closest<HTMLElement>(scopeSelector);
    };

    const queueMetricsSync = () => {
      if (metricsFrameRef.current !== null) {
        return;
      }

      metricsFrameRef.current = requestAnimationFrame(() => {
        metricsFrameRef.current = null;
        syncMetrics();
      });
    };

    const applyMotion = () => {
      const scopeElement = getScopeElement();
      if (!scopeElement) {
        frameRef.current = null;
        return;
      }

      const current = currentMotionRef.current;
      const target = targetMotionRef.current;

      current.rotateX = lerp(current.rotateX, target.rotateX, 0.16);
      current.rotateY = lerp(current.rotateY, target.rotateY, 0.16);
      current.shiftX = lerp(current.shiftX, target.shiftX, 0.18);
      current.shiftY = lerp(current.shiftY, target.shiftY, 0.18);

      applyMotionValues(scopeElement, current);

      if (hasVisibleDelta(current, target)) {
        frameRef.current = requestAnimationFrame(applyMotion);
        return;
      }

      frameRef.current = null;
    };

    const queueAnimationFrame = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(applyMotion);
    };

    const resetMotion = () => {
      if (isThemeTransitionLocked()) {
        return;
      }

      Object.assign(targetMotionRef.current, ZERO_MOTION);
      queueAnimationFrame();
    };

    const clearMotion = () => {
      const scopeElement = getScopeElement();
      if (!scopeElement) {
        return;
      }

      applyMotionValues(scopeElement, ZERO_MOTION);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      if (isThemeTransitionLocked()) {
        return;
      }

      const element = elementRef.current;
      if (!element) return;

      const metrics = metricsRef.current;
      const normalizedX = clamp((event.clientX - metrics.centerX) / metrics.halfWidth, -1, 1);
      const normalizedY = clamp((event.clientY - metrics.centerY) / metrics.halfHeight, -1, 1);
      const target = targetMotionRef.current;

      target.rotateX = normalizedY * -maxRotateX;
      target.rotateY = normalizedX * maxRotateY;
      target.shiftX = normalizedX * maxShiftX;
      target.shiftY = normalizedY * maxShiftY;

      queueAnimationFrame();
    };

    syncMetrics();

    const resizeObserver = new ResizeObserver(() => {
      queueMetricsSync();
    });
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", queueMetricsSync, { passive: true });
    window.addEventListener("scroll", queueMetricsSync, { passive: true });
    window.addEventListener("pointerleave", resetMotion);
    window.addEventListener("blur", resetMotion);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", queueMetricsSync);
      window.removeEventListener("scroll", queueMetricsSync);
      window.removeEventListener("pointerleave", resetMotion);
      window.removeEventListener("blur", resetMotion);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      if (metricsFrameRef.current !== null) {
        cancelAnimationFrame(metricsFrameRef.current);
      }

      clearMotion();
    };
  }, [enabled, maxRotateX, maxRotateY, maxShiftX, maxShiftY, scopeSelector]);

  return elementRef;
}
