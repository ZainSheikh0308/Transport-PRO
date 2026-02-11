"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardKpis, MonthlySummaryItem, YearlySummaryItem } from "@/lib/types";

type RouteSeries = { route: string; profit?: number; loss?: number };

type SummaryResponse = {
  ok: boolean;
  kpis: DashboardKpis;
  monthly: MonthlySummaryItem[];
  yearly: YearlySummaryItem[];
  topProfitRoutes: RouteSeries[];
  topLossRoutes: RouteSeries[];
};

const monthOptions = [
  "All",
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

export function DashboardView() {
  const [month, setMonth] = useState("All");
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/summaries?month=${encodeURIComponent(month)}`);
      const json = (await res.json()) as SummaryResponse;
      setData(json);
      setLoading(false);
    };
    void fetchData();
  }, [month]);

  const wrapperClass = useMemo(
    () =>
      theme === "dark"
        ? "space-y-4 text-slate-100"
        : "space-y-4 text-slate-900 [&_.card]:border-slate-200 [&_.card]:bg-white",
    [theme],
  );

  if (loading || !data) {
    return <div className="card p-6">Loading dashboard...</div>;
  }

  const k = data.kpis;
  const kpis = [
    { label: "Total Trips", value: k.totalTrips.toLocaleString() },
    { label: "Total Income", value: k.totalIncome.toFixed(2) },
    { label: "Total Expenses", value: k.totalExpenses.toFixed(2) },
    { label: "Total Profit", value: k.totalProfit.toFixed(2), tone: "text-emerald-400" },
    { label: "Total Loss", value: k.totalLoss.toFixed(2), tone: "text-rose-400" },
    { label: "Net Result", value: k.netResult.toFixed(2) },
  ];

  return (
    <div className={wrapperClass}>
      <div className="card flex items-center justify-between gap-3 p-4">
        <div>
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          <p className="text-sm text-slate-400">Modern overview with route profitability</p>
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={theme}
            onChange={(e) => setTheme(e.target.value as "dark" | "light")}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {kpis.map((item) => (
          <div key={item.label} className="card p-4">
            <p className="text-xs text-slate-400">{item.label}</p>
            <p className={`mt-2 text-2xl font-bold ${item.tone ?? ""}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h3 className="mb-3 font-semibold">Monthly Income vs Expense</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalIncome" stroke="#22c55e" />
                <Line type="monotone" dataKey="totalExpenses" stroke="#f97316" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="mb-3 font-semibold">Yearly Profit vs Loss</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.yearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#22c55e" />
                <Bar dataKey="loss" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h3 className="mb-3 font-semibold">Top 5 Profitable Routes ({month})</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProfitRoutes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="route" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="profit" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="mb-3 font-semibold">Top 5 Non-Profitable Routes ({month})</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topLossRoutes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="route" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="loss" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
