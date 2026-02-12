import { BackupPanel } from "@/components/backup-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <BackupPanel />
      <div className="card p-4 text-sm text-slate-400">
        <h3 className="text-base font-semibold text-slate-200">Subscription-ready fields</h3>
        <p className="mt-2">
          User documents already include <code>planStatus</code>, <code>planType</code>, and{" "}
          <code>billingState</code> for future subscription rollout.
        </p>
      </div>
    </div>
  );
}
