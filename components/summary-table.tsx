"use client";

import { useEffect, useState } from "react";
import type { MonthlySummaryItem, YearlySummaryItem } from "@/lib/types";

type SummaryResp = {
  ok: boolean;
  monthly: MonthlySummaryItem[];
  yearly: YearlySummaryItem[];
};

export function MonthlySummaryTable() {
  const [rows, setRows] = useState<MonthlySummaryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/summaries?month=All");
      const data = (await res.json()) as SummaryResp;
      setRows(data.monthly ?? []);
    };
    void load();
  }, []);

  return (
    <div className="card overflow-x-auto p-4">
      <h2 className="mb-3 text-lg font-semibold">Monthly Summary</h2>
      <table className="w-full text-sm">
        <thead className="text-left text-slate-400">
          <tr>
            <th className="p-2">Month</th>
            <th className="p-2">Trips</th>
            <th className="p-2">Expenses</th>
            <th className="p-2">Income</th>
            <th className="p-2">Additional</th>
            <th className="p-2">Profit</th>
            <th className="p-2">Loss</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.monthNo} className="border-t border-slate-800">
              <td className="p-2">{r.monthName}</td>
              <td className="p-2">{r.trips}</td>
              <td className="p-2">{r.totalExpenses.toFixed(2)}</td>
              <td className="p-2">{r.totalIncome.toFixed(2)}</td>
              <td className="p-2">{r.additionalExpenses.toFixed(2)}</td>
              <td className="p-2 text-emerald-400">{r.profit.toFixed(2)}</td>
              <td className="p-2 text-rose-400">{r.loss.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function YearlySummaryTable() {
  const [rows, setRows] = useState<YearlySummaryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/summaries?month=All");
      const data = (await res.json()) as SummaryResp;
      setRows(data.yearly ?? []);
    };
    void load();
  }, []);

  return (
    <div className="card overflow-x-auto p-4">
      <h2 className="mb-3 text-lg font-semibold">Yearly Summary</h2>
      <table className="w-full text-sm">
        <thead className="text-left text-slate-400">
          <tr>
            <th className="p-2">Year</th>
            <th className="p-2">Trips</th>
            <th className="p-2">Expenses</th>
            <th className="p-2">Income</th>
            <th className="p-2">Additional</th>
            <th className="p-2">Profit</th>
            <th className="p-2">Loss</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.year} className="border-t border-slate-800">
              <td className="p-2">{r.year}</td>
              <td className="p-2">{r.trips}</td>
              <td className="p-2">{r.totalExpenses.toFixed(2)}</td>
              <td className="p-2">{r.totalIncome.toFixed(2)}</td>
              <td className="p-2">{r.additionalExpenses.toFixed(2)}</td>
              <td className="p-2 text-emerald-400">{r.profit.toFixed(2)}</td>
              <td className="p-2 text-rose-400">{r.loss.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
