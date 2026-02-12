import { getStorageClient } from "@/lib/firebase/admin";
import { listRouteRecords } from "@/lib/repositories/routeRecordsRepo";

export async function createBusinessBackup(businessId: string) {
  const records = await listRouteRecords(businessId);
  const payload = {
    businessId,
    backedUpAt: new Date().toISOString(),
    records,
  };

  const bucket = getStorageClient().bucket();
  const path = `backups/${businessId}/backup-${Date.now()}.json`;
  const file = bucket.file(path);
  await file.save(JSON.stringify(payload, null, 2), {
    contentType: "application/json",
  });

  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  });

  return { path, signedUrl, count: records.length };
}
