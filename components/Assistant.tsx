"use client";
import { useRef, useState } from "react";
import Link from "next/link";
type Message = { text: string; href?: string; user?: boolean };
export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi, I’m Ava, the DK automated receptionist. This is a guided AI demo, not a live person. How can I point you in the right direction?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  async function send(message: string) {
    if (!message.trim() || busy) return;
    setInput("");
    setMessages((m) => [...m, { text: message, user: true }]);
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { text: data.text || data.error, href: data.href },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          text: "Chat is unavailable. Please call (678) 684-7341 for a human.",
        },
      ]);
    } finally {
      setBusy(false);
      ref.current?.focus();
    }
  }
  return (
    <aside className="assistant">
      <button
        className="assistant-toggle"
        aria-expanded={open}
        aria-controls="assistant-panel"
        onClick={() => setOpen(!open)}
      >
        <span className="avatar">a</span>
        <span>
          {open ? "Close assistant" : "Ask Ava"}
          <small>AI receptionist · Demo</small>
        </span>
        <span>{open ? "×" : "↗"}</span>
      </button>
      {open && (
        <section
          id="assistant-panel"
          className="chat-panel"
          aria-label="AI receptionist"
        >
          <div className="chat-heading">
            <strong>A little direction goes a long way.</strong>
            <p>
              Guided demo · No live voice connection. Please don’t share
              sensitive information.
            </p>
          </div>
          <div className="messages" role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={m.user ? "message user" : "message"}>
                <p>{m.text}</p>
                {m.href && (
                  <Link href={m.href} onClick={() => setOpen(false)}>
                    Continue here ↗
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="chat-choices">
            {[
              "Dumpster rental",
              "Sell a property",
              "Homeowner help",
              "Human",
            ].map((x) => (
              <button disabled={busy} key={x} onClick={() => send(x)}>
                {x}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              Message Ava
            </label>
            <input
              id="chat-input"
              ref={ref}
              maxLength={1000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can we help?"
              required
            />
            <button disabled={busy} aria-label="Send message">
              {busy ? "…" : "↑"}
            </button>
          </form>
        </section>
      )}
    </aside>
  );
}
