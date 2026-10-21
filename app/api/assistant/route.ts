import { z } from "zod";
import { body, guard, json } from "@/lib/http";
import { routeMessage } from "@/lib/assistant";
export async function POST(req: Request) {
  const denied = guard(req, "assistant", 40);
  if (denied) return denied;
  try {
    const data = z
      .object({ message: z.string().trim().min(1).max(1000) })
      .parse(await body(req));
    return json({ ...routeMessage(data.message), mode: "guided-demo" });
  } catch {
    return json(
      { error: "Please send a message of up to 1,000 characters." },
      400,
    );
  }
}
