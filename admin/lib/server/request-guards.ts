import "server-only";

import { NextResponse, type NextRequest } from "next/server";

const allowedOrigins = new Set(["http://127.0.0.1:3540", "http://localhost:3540"]);
const allowedHosts = new Set(["127.0.0.1:3540", "localhost:3540"]);

export function ensureLocalAdminMutation(request: NextRequest) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");

  if (!host || !allowedHosts.has(host)) {
    return NextResponse.json(
      {
        message: "Admin 写操作只允许从本地 3540 端口访问。",
      },
      { status: 403 }
    );
  }

  if (!origin || !allowedOrigins.has(origin)) {
    return NextResponse.json(
      {
        message: "非法的请求来源，当前写操作仅允许本地 Admin 页面触发。",
      },
      { status: 403 }
    );
  }

  return null;
}
