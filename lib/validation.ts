import { z } from "zod";
const text = (max = 300) => z.string().trim().max(max);
export const leadSchema = z
  .object({
    division: z.enum(["dumpster", "property", "homeowner"]),
    name: text(100).min(2),
    email: z.union([z.email().max(254), z.literal("")]),
    phone: text(30).regex(/^[+\d() .-]{7,30}$/),
    address: text(300).min(5),
    notes: text(2000),
    consent: z.boolean().default(false),
    website: text(200).default(""),
    debris: text(100).optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .or(z.literal(""))
      .optional(),
    size: text(100).optional(),
    access: text(500).optional(),
    condition: text(100).optional(),
    occupancy: text(100).optional(),
    timeline: text(100).optional(),
    price: text(50).optional(),
    relationship: text(100).optional(),
    situation: text(100).optional(),
  })
  .superRefine((v, ctx) => {
    const fields =
      v.division === "dumpster"
        ? ["debris", "size", "access"]
        : v.division === "property"
          ? ["condition", "occupancy", "timeline", "relationship"]
          : ["situation"];
    for (const field of fields)
      if (!v[field as keyof typeof v])
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: "Required for this service",
        });
  });
export const consentText =
  "You may contact me by human call or email about related DK Group services. This is optional and is not consent to automated calls, AI voice calls, or prerecorded marketing.";
export const contactSchema = z
  .string()
  .trim()
  .min(5)
  .max(254)
  .refine(
    (v) => z.email().safeParse(v).success || /^[+\d() .-]{7,30}$/.test(v),
    "Enter a valid email or phone number",
  );
export function normalizeContact(value: string) {
  return value.includes("@")
    ? value.toLowerCase()
    : value.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
}
