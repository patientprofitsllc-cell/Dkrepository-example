"use client";
import Link from "next/link";
import { useState } from "react";
export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="DK Group home">
      <span className="monogram">
        DK<span>↗</span>
      </span>
      <span>
        DK GROUP<small>PROPERTY. PEOPLE. POSSIBILITY.</small>
      </span>
    </Link>
  );
}
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <Logo />
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close ✕" : "Menu ☰"}
      </button>
      <nav
        id="navigation"
        className={open ? "nav open" : "nav"}
        aria-label="Main navigation"
      >
        <Link href="/dumpster-rentals" onClick={() => setOpen(false)}>
          Cleanouts & rentals
        </Link>
        <Link href="/sell-your-property" onClick={() => setOpen(false)}>
          Sell a property
        </Link>
        <Link href="/homeowner-solutions" onClick={() => setOpen(false)}>
          Homeowner solutions
        </Link>
        <Link href="/about" onClick={() => setOpen(false)}>
          About us
        </Link>
        <Link
          href="/contact"
          className="button small"
          onClick={() => setOpen(false)}
        >
          Let’s talk <span>↗</span>
        </Link>
      </nav>
    </header>
  );
}
