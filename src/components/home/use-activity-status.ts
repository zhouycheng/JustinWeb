"use client";

import { startTransition, useEffect, useEffectEvent, useState } from "react";

import type { ActivitySnapshot } from "@/lib/activity/types";

export function useActivityStatus(): ActivitySnapshot | null {
  const [status, setStatus] = useState<ActivitySnapshot | null>(null);

  const applyStatus = useEffectEvent((nextStatus: ActivitySnapshot | null) => {
    startTransition(() => {
      setStatus(nextStatus);
    });
  });

  useEffect(() => {
    const source = new EventSource("/api/activity/stream");

    source.onmessage = (event) => {
      try {
        const nextStatus = JSON.parse(event.data) as ActivitySnapshot | null;
        applyStatus(nextStatus);
      } catch {
        // Ignore malformed events and keep the last valid status.
      }
    };

    source.onerror = () => {
      // Let EventSource retry automatically. The server-side TTL will clear stale data.
    };

    return () => {
      source.close();
    };
  }, []);

  return status;
}
