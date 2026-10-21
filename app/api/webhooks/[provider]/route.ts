import { json } from "@/lib/http";
// Deliberately fail closed. Provider-specific SDK signature verification and event
// schemas must be configured before accepting real telephony traffic.
export async function POST() {
  return json(
    {
      error:
        "Inbound voice integration is not configured. No event was accepted.",
    },
    503,
  );
}
