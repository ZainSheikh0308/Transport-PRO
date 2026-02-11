import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
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

  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(18).text("Transport Business Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(11).text(`Generated At: ${new Date().toLocaleString()}`);
  doc.text(`Month Filter: ${month}`);
  doc.text(`Total Trips: ${summary.kpis.totalTrips}`);
  doc.text(`Total Income: ${summary.kpis.totalIncome.toFixed(2)}`);
  doc.text(`Total Expenses: ${summary.kpis.totalExpenses.toFixed(2)}`);
  doc.text(`Total Profit: ${summary.kpis.totalProfit.toFixed(2)}`);
  doc.text(`Total Loss: ${summary.kpis.totalLoss.toFixed(2)}`);
  doc.text(`Net Result: ${summary.kpis.netResult.toFixed(2)}`);
  doc.moveDown();
  doc.fontSize(13).text("Top 5 Profitable Routes");
  summary.topProfitRoutes.forEach((r, i) => {
    doc.fontSize(10).text(`${i + 1}. ${r.route} - ${r.profit.toFixed(2)}`);
  });
  doc.moveDown();
  doc.fontSize(13).text("Top 5 Non-Profitable Routes");
  summary.topLossRoutes.forEach((r, i) => {
    doc.fontSize(10).text(`${i + 1}. ${r.route} - ${r.loss.toFixed(2)}`);
  });

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="transport-report-${Date.now()}.pdf"`,
    },
  });
}
