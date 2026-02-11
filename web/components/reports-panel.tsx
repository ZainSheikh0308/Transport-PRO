"use client";

import { useState } from "react";

const months = [
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

export function ReportsPanel() {
  const [month, setMonth] = useState("All");
  const [shareText, setShareText] = useState("");

  const downloadPdf = async () => {
    const res = await fetch(`/api/reports/pdf?month=${encodeURIComponent(month)}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transport-report-${month}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareWhatsapp = async () => {
    const res = await fetch(`/api/reports/share?month=${encodeURIComponent(month)}`);
    const json = await res.json();
    setShareText(json.text ?? "");
    if (json.whatsappUrl) {
      window.open(json.whatsappUrl, "_blank");
    }
  };

  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold">PDF Reports & WhatsApp Share</h2>
      <p className="mt-1 text-sm text-slate-400">
        Generate monthly/yearly report PDFs and share a summary instantly.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={downloadPdf}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={shareWhatsapp}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
        >
          Share on WhatsApp
        </button>
      </div>

      {shareText ? (
        <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm">
          {shareText}
        </pre>
      ) : null}
    </div>
  );
}
