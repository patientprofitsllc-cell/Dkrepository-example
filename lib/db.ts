import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { consentText, normalizeContact, leadSchema } from "./validation";
import type { z } from "zod";
let database: DatabaseSync | undefined;
export function db() {
  if (database) return database;
  const path = resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH || ".data/dk.sqlite",
  );
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  database = new DatabaseSync(path);
  database.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY,division TEXT NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL,phone TEXT NOT NULL,address TEXT NOT NULL,details TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',consent INTEGER NOT NULL,consent_text TEXT NOT NULL,created_at TEXT NOT NULL,dedupe TEXT UNIQUE NOT NULL);
 CREATE TABLE IF NOT EXISTS activities(id TEXT PRIMARY KEY,lead_id TEXT REFERENCES leads(id),actor TEXT NOT NULL,action TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS appointments(id TEXT PRIMARY KEY,lead_id TEXT NOT NULL REFERENCES leads(id),starts_at TEXT NOT NULL,notes TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS suppression(contact TEXT PRIMARY KEY,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS webhook_events(id TEXT PRIMARY KEY,provider TEXT NOT NULL,created_at TEXT NOT NULL);
 `);
  return database;
}
export function audit(lead: string | null, actor: string, action: string) {
  db()
    .prepare("INSERT INTO activities VALUES(?,?,?,?,?)")
    .run(randomUUID(), lead, actor, action, new Date().toISOString());
}
export function suppressed(contact: string) {
  return !!db()
    .prepare("SELECT 1 FROM suppression WHERE contact=?")
    .get(normalizeContact(contact));
}
export function saveLead(data: z.infer<typeof leadSchema>) {
  const {
    division,
    name,
    email,
    phone,
    address,
    consent,
    website: _website,
    ...details
  } = data;
  void _website;
  const dedupe = createHash("sha256")
    .update(
      JSON.stringify({
        ...data,
        website: "",
        email: email.toLowerCase(),
        phone: normalizeContact(phone),
      }),
    )
    .digest("hex");
  const existing = db()
    .prepare("SELECT id FROM leads WHERE dedupe=?")
    .get(dedupe);
  if (existing) return { id: existing.id as string, duplicate: true };
  const id = randomUUID();
  db().exec("BEGIN IMMEDIATE");
  try {
    db()
      .prepare(
        "INSERT INTO leads(id,division,name,email,phone,address,details,consent,consent_text,created_at,dedupe) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
      )
      .run(
        id,
        division,
        name,
        email.toLowerCase(),
        normalizeContact(phone),
        address,
        JSON.stringify(details),
        consent ? 1 : 0,
        consentText,
        new Date().toISOString(),
        dedupe,
      );
    audit(id, "website", "Inquiry received; human follow-up requested");
    db().exec("COMMIT");
  } catch (e) {
    db().exec("ROLLBACK");
    throw e;
  }
  return { id, duplicate: false };
}
export function rateLimit(key: string, max = 8, window = 600_000) {
  const now = Date.now();
  const database = db();
  database.prepare("DELETE FROM limits WHERE expires < ?").run(now);
  database
    .prepare(
      "INSERT INTO limits VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
    )
    .run(key, now + window);
  return (
    (database.prepare("SELECT count FROM limits WHERE key=?").get(key)
      ?.count as number) <= max
  );
}
export function addSuppression(contact: string) {
  db()
    .prepare("INSERT OR IGNORE INTO suppression VALUES(?,?)")
    .run(normalizeContact(contact), new Date().toISOString());
  audit(null, "public", "Marketing suppression recorded");
}
