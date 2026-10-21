"use client";
import { useState } from "react";
export default function OptOut() {
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <section id="opt-out" className="optout">
      <h2>Manage contact preferences</h2>
      <p>
        Request marketing suppression for your email or phone number. This does
        not delete your records; contact our team for a privacy request.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const contact = new FormData(e.currentTarget).get("contact");
          try {
            const res = await fetch("/api/opt-out", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contact }),
            });
            const data = await res.json();
            setResult(data.message || data.error);
          } catch {
            setResult("Unable to save. Please call (678) 684-7341.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Email or phone number
          <input name="contact" required maxLength={254} />
        </label>
        <button disabled={busy} className="button">
          {busy ? "Saving…" : "Opt out of marketing"} ↗
        </button>
      </form>
      <p role="status">{result}</p>
    </section>
  );
}
