import { configured, signSession, verifyPassword, type Role } from "@/lib/auth";
import { body, guard, json } from "@/lib/http";
import { z } from "zod";
export async function POST(req: Request) {
  const denied = guard(req, "login", 5);
  if (denied) return denied;
  if (!configured())
    return json(
      {
        error:
          "CRM is locked. Configure credentials and SESSION_SECRET on the server.",
      },
      503,
    );
  try {
    const { role, password } = z
      .object({
        role: z.enum(["admin", "staff", "viewer"]),
        password: z.string().max(200),
      })
      .parse(await body(req));
    const hash = process.env[`${role.toUpperCase()}_PASSWORD_HASH`] || "";
    if (!verifyPassword(password, hash))
      return json({ error: "Invalid credentials." }, 401);
    const res = json({ role });
    res.headers.set(
      "Set-Cookie",
      `dk_session=${signSession(role as Role)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${new URL(req.url).protocol === "https:" ? "; Secure" : ""}`,
    );
    return res;
  } catch {
    return json({ error: "Invalid login." }, 400);
  }
}
