import { createHash } from "node:crypto";
import { rateLimit } from "./db";
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
export function guard(req: Request, bucket: string, max = 8) {
  const origin = req.headers.get("origin");
  const expected = new URL(process.env.APP_URL || req.url).origin;
  if (!origin || origin !== expected)
    return json({ error: "Request origin rejected." }, 403);
  if (!req.headers.get("content-type")?.includes("application/json"))
    return json({ error: "JSON required." }, 415);
  const ip =
    process.env.TRUST_PROXY === "true"
      ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
      : "shared";
  if (
    !rateLimit(
      `${bucket}:${createHash("sha256").update(ip).digest("hex")}`,
      max,
    )
  )
    return json(
      { error: "Too many requests. Please wait or call our team." },
      429,
    );
  return null;
}
export async function body(req: Request) {
  const raw = await req.text();
  if (Buffer.byteLength(raw) > 16000) throw new Error("Request too large");
  return JSON.parse(raw);
}
