"use client";

import { useState } from "react";

export function BackupPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    path: string;
    signedUrl: string;
    count: number;
  } | null>(null);

  const createBackup = async () => {
    setLoading(true);
    const res = await fetch("/api/backups/create", { method: "POST" });
    const json = await res.json();
    setResult(json.backup ?? null);
    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold">Cloud Backup</h2>
      <p className="mt-1 text-sm text-slate-400">
        Create a JSON backup in Firebase Cloud Storage.
      </p>
      <button
        type="button"
        onClick={createBackup}
        disabled={loading}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Creating backup..." : "Create backup now"}
      </button>

      {result ? (
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm">
          <p>Records backed up: {result.count}</p>
          <p className="mt-1 break-all text-slate-400">Path: {result.path}</p>
          <a
            href={result.signedUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-cyan-300 hover:text-cyan-200"
          >
            Download backup file
          </a>
        </div>
      ) : null}
    </div>
  );
}
