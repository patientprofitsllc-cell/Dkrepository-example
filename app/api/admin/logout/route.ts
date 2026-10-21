import { guard, json } from "@/lib/http";
export async function POST(req: Request) {
  const denied = guard(req, "logout", 30);
  if (denied) return denied;
  const res = json({ ok: true });
  res.headers.set(
    "Set-Cookie",
    "dk_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
  );
  return res;
}
