import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { readSiteContentBundle } from "@shared/content/read-content";
import { saveSiteContentBundle } from "@admin/lib/server/content-service";
import { ensureLocalAdminMutation } from "@admin/lib/server/request-guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(readSiteContentBundle());
}

export async function PUT(request: NextRequest) {
  const denied = ensureLocalAdminMutation(request);
  if (denied) {
    return denied;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "请求体不是合法 JSON。",
      },
      { status: 400 }
    );
  }

  try {
    const data = await saveSiteContentBundle(body);
    return NextResponse.json({
      ok: true,
      data,
      savedAt: Date.now(),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "内容校验失败，请检查表单字段。",
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "保存失败。";
    return NextResponse.json({ message }, { status: 500 });
  }
}
