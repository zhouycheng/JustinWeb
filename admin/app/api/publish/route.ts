import { NextRequest, NextResponse } from "next/server";

import { runPublishChecks } from "@admin/lib/server/publish-service";
import { ensureLocalAdminMutation } from "@admin/lib/server/request-guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const denied = ensureLocalAdminMutation(request);
  if (denied) {
    return denied;
  }

  const result = await runPublishChecks();

  return NextResponse.json(result, {
    status: result.ok ? 200 : 500,
  });
}
