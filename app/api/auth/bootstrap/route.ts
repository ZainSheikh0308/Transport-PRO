import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { ensureUserBusiness } from "@/lib/repositories/routeRecordsRepo";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const businessId = await ensureUserBusiness(user.uid, user.email);
  return NextResponse.json({ ok: true, businessId });
}
