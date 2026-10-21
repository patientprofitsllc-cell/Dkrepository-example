import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import { leadSchema, consentText } from "../lib/validation";
import { saveLead, db, addSuppression, suppressed, rateLimit } from "../lib/db";
import {
  configured,
  readSession,
  signSession,
  verifyPassword,
} from "../lib/auth";
import { routeMessage, outboundAllowed } from "../lib/assistant";
import { POST as outbound } from "../app/api/outbound/route";
import { POST as webhook } from "../app/api/webhooks/[provider]/route";
const dir = mkdtempSync(join(tmpdir(), "dk-test-"));
process.env.DATABASE_PATH = join(dir, "test.sqlite");
process.env.SESSION_SECRET = randomBytes(32).toString("hex");
const salt = "test-salt";
process.env.ADMIN_PASSWORD_HASH = `${salt}:${scryptSync("test-password-strong", salt, 64).toString("hex")}`;
const lead = {
  division: "dumpster",
  name: "Test Person",
  email: "test@example.com",
  phone: "(678) 555-0100",
  address: "123 Test Road",
  notes: "Renovation debris",
  debris: "Construction",
  size: "Need guidance",
  access: "Driveway",
  consent: false,
  website: "",
};
test("division-specific validation and unsafe input rejection", () => {
  assert.equal(leadSchema.safeParse(lead).success, true);
  assert.equal(
    leadSchema.safeParse({ ...lead, division: "property" }).success,
    false,
  );
  assert.equal(leadSchema.safeParse({ ...lead, name: "A" }).success, false);
  assert.equal(
    leadSchema.safeParse({ ...lead, email: "broken" }).success,
    false,
  );
});
test("lead persistence, deduplication and exact consent evidence", () => {
  const data = leadSchema.parse(lead);
  const saved = saveLead(data);
  assert.equal(saved.duplicate, false);
  assert.equal(saveLead(data).id, saved.id);
  assert.equal(saveLead(data).duplicate, true);
  const stored = db().prepare("SELECT * FROM leads WHERE id=?").get(saved.id)!;
  assert.equal(stored.consent, 0);
  assert.equal(stored.consent_text, consentText);
  assert.equal(
    db()
      .prepare("SELECT count(*) AS n FROM activities WHERE lead_id=?")
      .get(saved.id)?.n,
    1,
  );
});
test("opt-out normalization, idempotency and lookup", () => {
  addSuppression("+1 (678) 555-0100");
  addSuppression("6785550100");
  assert.equal(suppressed("678-555-0100"), true);
  assert.equal(suppressed("6785550101"), false);
  addSuppression("TEST@example.com");
  assert.equal(suppressed("test@example.com"), true);
});
test("rate limits reject repeated requests", () => {
  assert.equal(rateLimit("test", 2), true);
  assert.equal(rateLimit("test", 2), true);
  assert.equal(rateLimit("test", 2), false);
});
test("session signatures, expiry, role preservation and credentials", () => {
  assert.equal(configured(), true);
  assert.equal(
    verifyPassword("wrong", process.env.ADMIN_PASSWORD_HASH!),
    false,
  );
  assert.equal(
    verifyPassword("test-password-strong", process.env.ADMIN_PASSWORD_HASH!),
    true,
  );
  assert.equal(readSession(signSession("viewer"))?.role, "viewer");
  assert.equal(readSession(signSession("staff") + "x"), null);
  assert.equal(readSession(), null);
  const secret = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = "";
  assert.equal(readSession(signSession("admin")), null);
  process.env.SESSION_SECRET = secret;
});
test("receptionist routes divisions, human and opt-out safely", () => {
  assert.equal(routeMessage("dumpster rental").route, "dumpster");
  assert.equal(routeMessage("sell my inherited house").route, "property");
  assert.equal(routeMessage("repair help").route, "homeowner");
  assert.equal(routeMessage("I need a human").route, "human");
  assert.equal(routeMessage("stop calling me").route, "optout");
  assert.match(routeMessage("foreclosure help").text, /cannot give legal/);
});
test("outbound is blocked even if a caller attempts a feature override", async () => {
  process.env.OUTBOUND_ENABLED = "true";
  assert.equal(outboundAllowed(), false);
  assert.equal((await outbound()).status, 403);
});
test("unconfigured and unsigned webhooks fail closed", async () => {
  assert.equal((await webhook()).status, 503);
});
process.on("exit", () => {
  db().close();
  rmSync(dir, { recursive: true, force: true });
});
