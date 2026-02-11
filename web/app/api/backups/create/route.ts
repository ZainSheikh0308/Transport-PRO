import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { ensureUserBusiness } from "@/lib/repositories/routeRecordsRepo";
import { createBusinessBackup } from "@/lib/services/backupService";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const businessId = await ensureUserBusiness(user.uid, user.email);
  const backup = await createBusinessBackup(businessId);
  return NextResponse.json({ ok: true, backup });
}
