import { leadSchema } from "@/lib/validation";
import { saveLead } from "@/lib/db";
import { body, guard, json } from "@/lib/http";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const denied = guard(req, "leads");
  if (denied) return denied;
  try {
    const parsed = leadSchema.safeParse(await body(req));
    if (!parsed.success)
      return json(
        {
          error: "Please check the required fields.",
          fields: parsed.error.flatten().fieldErrors,
        },
        400,
      );
    if (parsed.data.website)
      return json({ error: "Unable to accept this inquiry." }, 400);
    const lead = saveLead(parsed.data);
    return json(
      {
        id: lead.id,
        message:
          "Your inquiry is saved for human review. No appointment, price, or availability is confirmed.",
      },
      lead.duplicate ? 200 : 201,
    );
  } catch {
    return json(
      {
        error:
          "We could not save your inquiry. Please try again or call (678) 684-7341.",
      },
      500,
    );
  }
}
