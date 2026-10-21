"use client";
import { useState } from "react";
import Link from "next/link";
import { divisions, type Division } from "@/lib/content";
import { consentText } from "@/lib/validation";
export default function LeadForm({
  division: initial = "dumpster",
  choose = false,
}: {
  division?: Division;
  choose?: boolean;
}) {
  const [division, setDivision] = useState<Division>(initial);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setResult("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          division,
          consent: data.consent === "on",
        }),
      });
      const payload = await res.json();
      setSuccess(res.ok);
      setResult(
        res.ok
          ? `${payload.message} Reference: ${payload.id}`
          : payload.error || "Please check your details.",
      );
      if (res.ok) form.reset();
    } catch {
      setSuccess(false);
      setResult("Unable to connect. Please try again or call (678) 684-7341.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="inquiry" className="inquiry">
      <div>
        <p className="eyebrow red">YOUR NEXT STEP</p>
        <h2>
          {division === "dumpster"
            ? "Let’s talk about your project."
            : division === "property"
              ? "Tell us about your property."
              : "You don’t have to figure it out alone."}
        </h2>
        <p>{divisions[division].description}</p>
        <div className="contact-note">
          <span>↗</span>
          <div>
            <strong>Prefer a conversation?</strong>
            <a href="tel:+16786847341">(678) 684-7341</a>
            <small>Your inquiry goes to a human team member.</small>
          </div>
        </div>
        <p className="fine-print">
          Please do not include Social Security numbers, financial account
          information, medical details, or sensitive legal documents.
        </p>
      </div>
      <form
        className="lead-form"
        onSubmit={submit}
        aria-label="Service inquiry"
      >
        {choose && (
          <label className="full">
            How can we help?
            <select
              value={division}
              onChange={(e) => {
                setDivision(e.target.value as Division);
                setResult("");
              }}
            >
              {Object.entries(divisions).map(([key, d]) => (
                <option value={key} key={key}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Your name *
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label>
          Phone *
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            pattern="[+0-9() .\-]{7,30}"
            maxLength={30}
          />
        </label>
        <label className="full">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
          />
        </label>
        <label className="full">
          {division === "dumpster" ? "Service address" : "Property address"} *
          <input
            name="address"
            autoComplete="street-address"
            required
            minLength={5}
            maxLength={300}
          />
        </label>
        {division === "dumpster" ? (
          <>
            <label>
              Debris type *
              <select name="debris" required>
                <option value="">Select type</option>
                {[
                  "Construction / renovation",
                  "Household / cleanout",
                  "Yard / tree debris",
                  "Other / unsure",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Requested date
              <input
                type="date"
                name="date"
                min={new Date().toISOString().slice(0, 10)}
              />
            </label>
            <label>
              Estimated size *
              <select name="size" required>
                <option value="">Select estimate</option>
                {[
                  "Small project",
                  "Medium project",
                  "Large cleanout",
                  "Need guidance",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Site access *
              <input
                name="access"
                required
                maxLength={500}
                placeholder="Driveway, gate, restrictions…"
              />
            </label>
          </>
        ) : division === "property" ? (
          <>
            <label>
              Property condition *
              <select required name="condition">
                <option value="">Select condition</option>
                {[
                  "Move-in ready",
                  "Needs repairs",
                  "Fire damaged",
                  "Distressed / unsure",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Occupancy *
              <select required name="occupancy">
                <option value="">Select occupancy</option>
                {["Owner occupied", "Tenant occupied", "Vacant", "Unsure"].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Timeline *
              <select name="timeline" required>
                <option value="">Select timeline</option>
                {[
                  "As soon as practical",
                  "1–3 months",
                  "3+ months",
                  "Just exploring",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Your relationship *
              <select name="relationship" required>
                <option value="">Select relationship</option>
                {[
                  "Owner",
                  "Heir / estate representative",
                  "Authorized representative",
                  "Other",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="full">
              Desired price (optional)
              <input
                name="price"
                maxLength={50}
                placeholder="An estimate is fine"
              />
            </label>
          </>
        ) : (
          <label className="full">
            What would you like to discuss? *
            <select name="situation" required>
              <option value="">Select a topic</option>
              {[
                "Repairs",
                "Inherited property",
                "Potential foreclosure",
                "Liens",
                "Relocation",
                "Other / prefer a conversation",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        )}
        <label className="full">
          Anything else we should know?
          <textarea name="notes" maxLength={2000} rows={3} />
        </label>
        <label className="honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="checkbox full">
          <input name="consent" type="checkbox" />
          <span>{consentText}</span>
        </label>
        <p className="fine-print full">
          Submitting requests a human response to this inquiry. It does not
          authorize AI telemarketing or confirm an appointment. Read our{" "}
          <Link href="/privacy">privacy notice</Link>.
        </p>
        <button className="button full" disabled={busy}>
          {busy
            ? "Saving inquiry…"
            : division === "dumpster"
              ? "Request a quote"
              : "Request a human consultation"}
          <span>↗</span>
        </button>
        {result && (
          <p
            className={`form-result full ${success ? "success" : ""}`}
            role="status"
          >
            {result}
          </p>
        )}
      </form>
    </section>
  );
}
