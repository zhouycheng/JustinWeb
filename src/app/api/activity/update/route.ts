import { NextRequest, NextResponse } from "next/server";

import {
  activityStatusStore,
  DEFAULT_ACTIVITY_TTL_MS,
} from "@/lib/activity/store";
import type { ActivityUpdatePayload, ActivityWireState } from "@/lib/activity/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = false;

function getMonitorToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return request.headers.get("x-activity-token");
}

function parseState(value: unknown): ActivityWireState | null {
  return value === "active" || value === "inactive" ? value : null;
}

function parseActivityPayload(body: unknown): ActivityUpdatePayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const candidate = body as Record<string, unknown>;
  const state = parseState(candidate.state);
  if (!state) {
    return null;
  }

  const rawAppName = candidate.appName;
  const appName =
    typeof rawAppName === "string" && rawAppName.trim().length > 0
      ? rawAppName.trim().slice(0, 120)
      : null;

  const rawObservedAt = candidate.observedAt;
  const observedAt =
    typeof rawObservedAt === "number" && Number.isFinite(rawObservedAt)
      ? rawObservedAt
      : undefined;

  const rawSessionId = candidate.sessionId;
  const sessionId =
    typeof rawSessionId === "string" && rawSessionId.trim().length > 0
      ? rawSessionId.trim().slice(0, 120)
      : null;

  return {
    appName,
    state,
    observedAt,
    sessionId,
  };
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.ACTIVITY_MONITOR_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { message: "ACTIVITY_MONITOR_TOKEN is not configured." },
      { status: 503 }
    );
  }

  const token = getMonitorToken(request);
  if (token !== expectedToken) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const payload = parseActivityPayload(body);
  if (!payload) {
    return NextResponse.json({ message: "Invalid activity payload." }, { status: 400 });
  }

  console.log("[activity-update] payload", payload);

  const snapshot = activityStatusStore.update(payload, DEFAULT_ACTIVITY_TTL_MS);

  console.log("[activity-update] snapshot", snapshot);

  return NextResponse.json({
    ok: true,
    active: Boolean(snapshot),
    ttlMs: DEFAULT_ACTIVITY_TTL_MS,
  });
}
