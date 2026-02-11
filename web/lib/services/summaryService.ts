import { listRouteRecords } from "@/lib/repositories/routeRecordsRepo";
import type {
  DashboardKpis,
  MonthlySummaryItem,
  RouteRecord,
  YearlySummaryItem,
} from "@/lib/types";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseParts(dateText: string) {
  const m = dateText.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = m[3].length === 2 ? Number(`20${m[3]}`) : Number(m[3]);
  if (!day || month < 1 || month > 12) return null;
  return { day, month, year };
}

export function buildMonthlySummary(records: RouteRecord[], year: number): MonthlySummaryItem[] {
  const result = Array.from({ length: 12 }, (_, i) => ({
    year,
    monthNo: i + 1,
    monthName: monthNames[i],
    trips: 0,
    totalExpenses: 0,
    totalIncome: 0,
    additionalExpenses: 0,
    profit: 0,
    loss: 0,
  }));

  for (const r of records) {
    const p = parseParts(r.departureDate);
    if (!p || p.year !== year) continue;
    const row = result[p.month - 1];
    row.trips += 1;
    row.totalExpenses += r.totalExpenses;
    row.totalIncome += r.totalIncome;
    row.additionalExpenses += r.additionalExpenseAmount;
    row.profit += r.profit;
    row.loss += r.loss;
  }

  return result;
}

export function buildYearlySummary(records: RouteRecord[], currentYear: number): YearlySummaryItem[] {
  const startYear = currentYear - 4;
  const years = Array.from({ length: 10 }, (_, i) => startYear + i);
  const map = new Map<number, YearlySummaryItem>();

  for (const y of years) {
    map.set(y, {
      year: y,
      trips: 0,
      totalExpenses: 0,
      totalIncome: 0,
      additionalExpenses: 0,
      profit: 0,
      loss: 0,
    });
  }

  for (const r of records) {
    const p = parseParts(r.departureDate);
    if (!p) continue;
    const row = map.get(p.year);
    if (!row) continue;
    row.trips += 1;
    row.totalExpenses += r.totalExpenses;
    row.totalIncome += r.totalIncome;
    row.additionalExpenses += r.additionalExpenseAmount;
    row.profit += r.profit;
    row.loss += r.loss;
  }

  return years.map((y) => map.get(y)!);
}

export function buildKpis(records: RouteRecord[]): DashboardKpis {
  const totalTrips = records.length;
  const totalIncome = records.reduce((sum, r) => sum + r.totalIncome, 0);
  const totalExpenses = records.reduce(
    (sum, r) => sum + r.totalExpenses + r.additionalExpenseAmount,
    0,
  );
  const totalProfit = records.reduce((sum, r) => sum + r.profit, 0);
  const totalLoss = records.reduce((sum, r) => sum + r.loss, 0);

  return {
    totalTrips,
    totalIncome,
    totalExpenses,
    totalProfit,
    totalLoss,
    netResult: totalProfit - totalLoss,
  };
}

export function buildTopRoutes(records: RouteRecord[], monthFilter: string) {
  const monthNo = monthFilter === "All" ? 0 : monthNames.indexOf(monthFilter) + 1;
  const map = new Map<string, { profit: number; loss: number }>();

  for (const r of records) {
    const p = parseParts(r.departureDate);
    if (!p) continue;
    if (monthNo > 0 && p.month !== monthNo) continue;

    const existing = map.get(r.route) ?? { profit: 0, loss: 0 };
    existing.profit += r.profit;
    existing.loss += r.loss;
    map.set(r.route, existing);
  }

  const entries = [...map.entries()].map(([route, v]) => ({ route, ...v }));
  const topProfitRoutes = [...entries].sort((a, b) => b.profit - a.profit).slice(0, 5);
  const topLossRoutes = [...entries].sort((a, b) => b.loss - a.loss).slice(0, 5);

  return { topProfitRoutes, topLossRoutes };
}

export async function getSummaryBundle(businessId: string, monthFilter: string) {
  const records = await listRouteRecords(businessId);
  const year = new Date().getFullYear();

  return {
    records,
    kpis: buildKpis(records),
    monthly: buildMonthlySummary(records, year),
    yearly: buildYearlySummary(records, year),
    ...buildTopRoutes(records, monthFilter),
  };
}
