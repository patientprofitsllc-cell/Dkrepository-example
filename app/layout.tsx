import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Fraunces, Inter_Tight } from "next/font/google";
import Header, { Logo } from "@/components/Header";
import Assistant from "@/components/Assistant";
import Motion from "@/components/Motion";
import { siteUrl, organizationSchema } from "@/lib/schema";
import "./globals.css";
import "./cinematic.css";
const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "DK Group | Dumpster Rentals, As-Is Home Sales & Homeowner Help in Columbus, GA",
    template: "%s | DK Group · Columbus, GA",
  },
  description:
    "Dumpster rentals and cleanouts, as-is property acquisitions, and no-pressure homeowner consultations from one Columbus, Georgia team. Talk with a real person.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DK Group — Every property. Every situation. A way forward.",
    description:
      "Dumpster rentals & cleanouts, as-is property sales and homeowner consultations in Columbus, Georgia.",
    type: "website",
    locale: "en_US",
    siteName: "DK Group",
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  themeColor: "#111312",
  colorScheme: "light",
};
// Runs before paint: enables the motion layer's hidden start states only
// when scripting works and reduced motion is not requested. If the motion
// bundle never loads, the fallback removes the class so nothing stays hidden.
const motionBoot = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('motion');setTimeout(function(){if(!window.__dkMotion)d.classList.remove('motion')},4000)}catch(e){}})();`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>
        <Motion />
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
