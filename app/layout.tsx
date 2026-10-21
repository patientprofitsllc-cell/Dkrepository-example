import type { Metadata } from "next";
import Link from "next/link";
import Header, { Logo } from "@/components/Header";
import Assistant from "@/components/Assistant";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: {
    default: "DK Group | Property. People. Possibility.",
    template: "%s | DK Group",
  },
  description:
    "Dumpster and cleanout inquiries, as-is property acquisitions, and homeowner consultations. Based in Columbus, Georgia.",
  openGraph: {
    title: "DK Group",
    description: "Three services. One thoughtful way forward.",
    type: "website",
    images: ["/architecture.svg"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <footer>
          <div className="footer-top">
            <div>
              <Logo />
              <p>
                Good people.
                <br />
                Thoughtful solutions.
                <br />
                New possibilities.
              </p>
            </div>
            <div>
              <h3>Find your next step</h3>
              <Link href="/dumpster-rentals">Dumpster rentals & cleanouts</Link>
              <Link href="/sell-your-property">Sell your property</Link>
              <Link href="/homeowner-solutions">Homeowner solutions</Link>
            </div>
            <div>
              <h3>Let’s connect</h3>
              <a href="tel:+16786847341">(678) 684-7341</a>
              <Link href="/contact">Contact our team ↗</Link>
              <a
                href="https://www.instagram.com/dk_investor1/"
                rel="noreferrer"
              >
                Instagram ↗
              </a>
              <span>Columbus, Georgia</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} DK Group. All rights reserved.
            </span>
            <div>
              <Link href="/faq">FAQ</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/admin">Team login</Link>
            </div>
          </div>
          <p className="footer-note">
            Service area, availability, and acquisition eligibility are
            confirmed individually. Homeowner Solutions is a service division.
            Architecture shown is an original illustration, not project
            photography.
          </p>
        </footer>
        <Assistant />
      </body>
    </html>
  );
}
