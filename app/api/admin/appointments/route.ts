import { sessionFromRequest } from "@/lib/auth";
import { audit, db } from "@/lib/db";
import { body, guard, json } from "@/lib/http";
import { z } from "zod";
import { randomUUID } from "node:crypto";
export async function POST(req: Request) {
  const denied = guard(req, "appointments", 50);
  if (denied) return denied;
  const session = sessionFromRequest(req);
  if (!session) return json({ error: "Sign in required." }, 401);
  if (session.role === "viewer") return json({ error: "Read-only role." }, 403);
  try {
    const data = z
      .object({
        leadId: z.uuid(),
        startsAt: z.iso.datetime(),
        notes: z.string().trim().max(500),
      })
      .parse(await body(req));
    if (Date.parse(data.startsAt) <= Date.now())
      return json({ error: "Choose a future time." }, 400);
    if (!db().prepare("SELECT id FROM leads WHERE id=?").get(data.leadId))
      return json({ error: "Lead not found." }, 404);
    const id = randomUUID();
    db()
      .prepare("INSERT INTO appointments VALUES(?,?,?,?,?)")
      .run(
        id,
        data.leadId,
        data.startsAt,
        data.notes,
        new Date().toISOString(),
      );
    audit(
      data.leadId,
      session.role,
      `Internal appointment recorded for ${data.startsAt}; customer confirmation required`,
    );
    return json({ id }, 201);
  } catch {
    return json({ error: "Invalid appointment." }, 400);
  }
}
