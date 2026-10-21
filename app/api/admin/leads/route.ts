import { sessionFromRequest } from "@/lib/auth";
import { audit, db, suppressed } from "@/lib/db";
import { body, guard, json } from "@/lib/http";
import { z } from "zod";
export async function GET(req: Request) {
  const session = sessionFromRequest(req);
  if (!session) return json({ error: "Sign in required." }, 401);
  const leads = db()
    .prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 500")
    .all()
    .map((l) => ({
      ...l,
      details: JSON.parse(l.details as string),
      suppressed:
        suppressed(l.email as string) || suppressed(l.phone as string),
    }));
  return json({
    role: session.role,
    leads,
    activities: db()
      .prepare("SELECT * FROM activities ORDER BY created_at DESC LIMIT 200")
      .all(),
    appointments: db()
      .prepare("SELECT * FROM appointments ORDER BY starts_at")
      .all(),
  });
}
export async function PATCH(req: Request) {
  const denied = guard(req, "crm", 100);
  if (denied) return denied;
  const session = sessionFromRequest(req);
  if (!session) return json({ error: "Sign in required." }, 401);
  if (session.role === "viewer") return json({ error: "Read-only role." }, 403);
  try {
    const { id, status } = z
      .object({
        id: z.uuid(),
        status: z.enum(["new", "contacted", "qualified", "closed"]),
      })
      .parse(await body(req));
    if (!db().prepare("SELECT id FROM leads WHERE id=?").get(id))
      return json({ error: "Lead not found." }, 404);
    db().prepare("UPDATE leads SET status=? WHERE id=?").run(status, id);
    audit(id, session.role, `Status changed to ${status}`);
    return json({ ok: true });
  } catch {
    return json({ error: "Invalid update." }, 400);
  }
}
