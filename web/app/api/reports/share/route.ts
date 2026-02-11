import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { ensureUserBusiness } from "@/lib/repositories/routeRecordsRepo";
import { getSummaryBundle } from "@/lib/services/summaryService";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const month = url.searchParams.get("month") ?? "All";
  const businessId = await ensureUserBusiness(user.uid, user.email);
  const summary = await getSummaryBundle(businessId, month);

  const text = [
    "Transport Business Report",
    `Month: ${month}`,
    `Trips: ${summary.kpis.totalTrips}`,
    `Income: ${summary.kpis.totalIncome.toFixed(2)}`,
    `Expenses: ${summary.kpis.totalExpenses.toFixed(2)}`,
    `Profit: ${summary.kpis.totalProfit.toFixed(2)}`,
    `Loss: ${summary.kpis.totalLoss.toFixed(2)}`,
    `Net: ${summary.kpis.netResult.toFixed(2)}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  return NextResponse.json({ ok: true, text, whatsappUrl });
}
