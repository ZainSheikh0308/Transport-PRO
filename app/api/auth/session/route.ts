import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

const bodySchema = z.object({
  idToken: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const decoded = await getAdminAuth().verifyIdToken(body.idToken);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, body.idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Invalid session request",
      },
      { status: 400 },
    );
  }
}
