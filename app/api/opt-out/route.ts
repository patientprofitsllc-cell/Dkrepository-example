import { addSuppression } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { body, guard, json } from "@/lib/http";
export async function POST(req: Request) {
  const denied = guard(req, "optout", 20);
  if (denied) return denied;
  try {
    const data = await body(req);
    const contact = contactSchema.parse(data.contact);
    addSuppression(contact);
    return json({
      message:
        "Your marketing opt-out has been recorded. No automated outbound calling is enabled.",
    });
  } catch {
    return json({ error: "Enter a valid email or phone number." }, 400);
  }
}
