import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createRouteRecord,
  deleteRouteRecord,
  ensureUserBusiness,
  listRouteRecords,
  updateRouteRecord,
} from "@/lib/repositories/routeRecordsRepo";
import { routeRecordSchema } from "@/lib/validators/record";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const businessId = await ensureUserBusiness(user.uid, user.email);
  const items = await listRouteRecords(businessId);
  return NextResponse.json({ ok: true, items });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = routeRecordSchema.parse(await request.json());
    const businessId = await ensureUserBusiness(user.uid, user.email);
    const item = await createRouteRecord(businessId, user.uid, payload);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Bad request" },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...rest } = await request.json();
    const payload = routeRecordSchema.parse(rest);
    const businessId = await ensureUserBusiness(user.uid, user.email);
    const item = await updateRouteRecord(businessId, id, payload);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Bad request" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, message: "Missing id" }, { status: 400 });
  }

  const businessId = await ensureUserBusiness(user.uid, user.email);
  await deleteRouteRecord(businessId, id);
  return NextResponse.json({ ok: true });
}
