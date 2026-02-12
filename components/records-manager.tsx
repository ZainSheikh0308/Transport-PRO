"use client";

import { useEffect, useMemo, useState } from "react";
import type { RouteRecord } from "@/lib/types";

const emptyForm = {
  departureDate: "",
  returnDate: "",
  route: "",
  dieselExpense: 0,
  oilExpense: 0,
  rationFoodExpense: 0,
  mobileExpense: 0,
  miscExpense: 0,
  driverSalary: 0,
  garageExpense: 0,
  serviceExpense: 0,
  income1: 0,
  income2: 0,
  income3: 0,
  income4: 0,
  additionalExpenseDetail: "",
  additionalExpenseAmount: 0,
};

export function RecordsManager() {
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState<RouteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    const res = await fetch("/api/records");
    const json = await res.json();
    setItems(json.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const loadInitial = async () => {
      const res = await fetch("/api/records");
      const json = await res.json();
      setItems(json.items ?? []);
      setLoading(false);
    };
    void loadInitial();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!json.ok) {
      setError(json.message ?? "Could not save record");
    } else {
      setForm(emptyForm);
      await fetchRecords();
    }
    setSubmitting(false);
  };

  const remove = async (id: string) => {
    await fetch(`/api/records?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await fetchRecords();
  };

  const totals = useMemo(() => {
    const income = items.reduce((s, i) => s + i.totalIncome, 0);
    const expenses = items.reduce((s, i) => s + i.totalExpenses + i.additionalExpenseAmount, 0);
    const profit = items.reduce((s, i) => s + i.profit, 0);
    const loss = items.reduce((s, i) => s + i.loss, 0);
    return { income, expenses, profit, loss };
  }, [items]);

  return (
    <div className="space-y-4">
      <form className="card p-4" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">Daily Route Record Entry</h2>
        <p className="mt-1 text-xs text-slate-400">Use dd/mm/yyyy format for both dates.</p>

        <div className="mt-4 grid gap-2 md:grid-cols-4">
          {(
            [
              ["departureDate", "Departure Date"],
              ["returnDate", "Return Date"],
              ["route", "Route"],
              ["dieselExpense", "Diesel Expense"],
              ["oilExpense", "Oil Expense"],
              ["rationFoodExpense", "Ration/Food Expense"],
              ["mobileExpense", "Mobile Expense"],
              ["miscExpense", "Misc Expense"],
              ["driverSalary", "Driver Salary"],
              ["garageExpense", "Garage Expense"],
              ["serviceExpense", "Service Expense"],
              ["income1", "Income 1"],
              ["income2", "Income 2"],
              ["income3", "Income 3"],
              ["income4", "Income 4"],
              ["additionalExpenseDetail", "Additional Detail"],
              ["additionalExpenseAmount", "Additional Amount"],
            ] as const
          ).map(([key, label]) => (
            <input
              key={key}
              required={key === "departureDate" || key === "returnDate" || key === "route"}
              type={key.includes("Date") || key.includes("route") || key.includes("Detail") ? "text" : "number"}
              placeholder={label}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={(form as Record<string, string | number>)[key]}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  [key]:
                    key.includes("Date") || key.includes("route") || key.includes("Detail")
                      ? e.target.value
                      : Number(e.target.value || 0),
                }))
              }
            />
          ))}
        </div>

        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save record"}
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="card p-3">
          <p className="text-xs text-slate-400">Total Income</p>
          <p className="text-xl font-bold">{totals.income.toFixed(2)}</p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-slate-400">Total Expenses</p>
          <p className="text-xl font-bold">{totals.expenses.toFixed(2)}</p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-slate-400">Total Profit</p>
          <p className="text-xl font-bold text-emerald-400">{totals.profit.toFixed(2)}</p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-slate-400">Total Loss</p>
          <p className="text-xl font-bold text-rose-400">{totals.loss.toFixed(2)}</p>
        </div>
      </div>

      <div className="card overflow-x-auto p-4">
        <h3 className="mb-3 font-semibold">Recent Records</h3>
        {loading ? (
          <p>Loading records...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="p-2">Departure</th>
                <th className="p-2">Return</th>
                <th className="p-2">Route</th>
                <th className="p-2">Expenses</th>
                <th className="p-2">Income</th>
                <th className="p-2">Profit</th>
                <th className="p-2">Loss</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-800">
                  <td className="p-2">{item.departureDate}</td>
                  <td className="p-2">{item.returnDate}</td>
                  <td className="p-2">{item.route}</td>
                  <td className="p-2">{(item.totalExpenses + item.additionalExpenseAmount).toFixed(2)}</td>
                  <td className="p-2">{item.totalIncome.toFixed(2)}</td>
                  <td className="p-2 text-emerald-400">{item.profit.toFixed(2)}</td>
                  <td className="p-2 text-rose-400">{item.loss.toFixed(2)}</td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => void remove(item.id)}
                      className="rounded bg-rose-700 px-2 py-1 text-xs hover:bg-rose-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
