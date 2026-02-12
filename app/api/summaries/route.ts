import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { ensureUserBusiness } from "@/lib/repositories/routeRecordsRepo";
import { getSummaryBundle } from "@/lib/services/summaryService";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const month = url.searchParams.get("month") ?? "All";
    const businessId = await ensureUserBusiness(user.uid, user.email);
    const summary = await getSummaryBundle(businessId, month);

    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Failed to load summaries",
      },
      { status: 500 },
    );
  }
}
