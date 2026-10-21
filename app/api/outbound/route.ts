import { json } from "@/lib/http";
export async function POST() {
  return json(
    {
      error:
        "Automated outbound calling is disabled pending legal approval. No dialing adapter is installed.",
    },
    403,
  );
}
