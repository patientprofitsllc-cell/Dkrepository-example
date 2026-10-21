import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { divisions, faqs, type Division } from "@/lib/content";
import LeadForm from "@/components/LeadForm";
import OptOut from "@/components/OptOut";
const serviceSlugs: Record<string, Division> = {
  "dumpster-rentals": "dumpster",
  "sell-your-property": "property",
  "homeowner-solutions": "homeowner",
};
const titles: Record<string, string> = {
  "dumpster-rentals": "Dumpster rentals & cleanouts",
  "sell-your-property": "Sell your property",
  "homeowner-solutions": "Homeowner solutions",
  about: "About us",
  contact: "Let’s talk",
  faq: "Questions, answered",
  privacy: "Privacy notice",
  terms: "Terms of use",
};
export function generateStaticParams() {
  return Object.keys(titles).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: titles[slug] || "Not found",
    alternates: { canonical: `/${slug}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!titles[slug]) notFound();
  const division = serviceSlugs[slug];
  if (division) {
    const d = divisions[division];
    return (
      <>
        <section className={`page-hero division-${division}`}>
          <p className="eyebrow red">{d.name}</p>
          <h1>{d.title}</h1>
          <p>{d.description}</p>
          <a className="button" href="#inquiry">
            {division === "dumpster"
              ? "Request a quote"
              : "Start a conversation"}{" "}
            ↗
          </a>
          <div className="service-tags">
            {d.tags.map((x) => (
              <span key={x}>↗ {x}</span>
            ))}
          </div>
        </section>
        <section className="section service-explainer">
          <p className="eyebrow red">CLEAR EXPECTATIONS</p>
          <h2>{d.short}</h2>
          <p>
            {division === "dumpster"
              ? "Share your project details and we’ll review the right next step. Pricing, accepted materials, dumpster sizes, inventory, placement, permits, and delivery dates require confirmation. Do not load hazardous materials without explicit approval."
              : division === "property"
                ? "Every property and situation is different. Our team reviews your inquiry before discussing any potential purchase. No offer, closing date, eligibility, or valuation is guaranteed. You are free to seek independent advice."
                : "Homeowner Solutions is a DK Group service division offering intake and human consultation. We do not provide legal, tax, financial, or foreclosure rescue advice. We cannot guarantee that a foreclosure will be prevented or a lien resolved. For urgent deadlines, contact a qualified attorney or HUD-approved housing counselor."}
          </p>
        </section>
        <div className="section form-section">
          <LeadForm division={division} />
        </div>
      </>
    );
  }
  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow red">DK GROUP · COLUMBUS, GEORGIA</p>
        <h1>{titles[slug]}</h1>
        <p>
          {slug === "about"
            ? "Different services. A shared belief that people come first."
            : slug === "contact"
              ? "A project, a property, or a question. We’re here to listen."
              : slug === "faq"
                ? "A little clarity before your next step."
                : "Clear information about using this website."}
        </p>
      </section>
      <section className="section editorial">
        {slug === "about" ? (
          <>
            <h2>
              Practical help.
              <br />
              Personal conversations.
            </h2>
            <p>
              DK Group brings three related service operations together: DMK
              Home Improvement LLC for dumpster rentals and cleanouts, DK Entity
              LLC for property acquisition inquiries, and Homeowner Solutions
              for consultation intake.
            </p>
            <p>
              Based in Columbus, Georgia, our approach starts with understanding
              your situation. We confirm coverage, service availability, and
              acquisition eligibility with you individually, rather than making
              promises before we know the details.
            </p>
            <h3>Three doors. One place to begin.</h3>
            {Object.values(divisions).map((d) => (
              <p key={d.name}>
                <Link href={d.href}>{d.name} ↗</Link> — {d.description}
              </p>
            ))}
            <p>
              Homeowner Solutions is a service division, not a verified separate
              legal entity. Original logos, project photography, and broader
              service-area claims remain subject to owner verification before
              publication.
            </p>
          </>
        ) : slug === "contact" ? (
          <>
            <div className="contact-grid">
              <div>
                <h2>Talk with our team.</h2>
                <a href="tel:+16786847341">(678) 684-7341</a>
                <p>
                  Service inquiries:{" "}
                  <a href="mailto:service@dmkentityllcflip.com">
                    service@dmkentityllcflip.com
                  </a>
                </p>
                <p>
                  Property inquiries:{" "}
                  <a href="mailto:investor@dkentityllcflip.com">
                    investor@dkentityllcflip.com
                  </a>
                </p>
                <p>
                  Columbus, Georgia
                  <br />
                  Coverage confirmed by address.
                </p>
              </div>
              <div className="notice">
                <h3>Your pace. Your decision.</h3>
                <p>
                  Request human follow-up below. An inquiry doesn’t confirm an
                  appointment, quote, or purchase offer. If you have an urgent
                  legal or financial deadline, consult a qualified professional.
                </p>
              </div>
            </div>
            <LeadForm choose />
            <OptOut />
          </>
        ) : slug === "faq" ? (
          <div className="faqs">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        ) : slug === "privacy" ? (
          <>
            <h2>Privacy & your choices</h2>
            <p>
              This application stores inquiry details you submit: name, contact
              details, service or property address, division-specific answers,
              optional notes, optional contact permission, exact consent
              wording, and submission time. Internal staff may record status
              changes, activities, and appointments.
            </p>
            <h3>Purpose and access</h3>
            <p>
              These records support human review and responses to your inquiry.
              Access is restricted to authenticated team roles. The guided demo
              chat uses rule-based routing; messages are processed for that
              response and are not stored as conversation records. No external
              AI provider is connected.
            </p>
            <h3>Contact preferences</h3>
            <p>
              Optional marketing permission is separate from your inquiry.
              Submission is not automated voice or AI telemarketing consent.
              Automated outbound calling is disabled. Use the{" "}
              <Link href="/contact#opt-out">opt-out form</Link> to record email
              or phone suppression.
            </p>
            <h3>Storage and retention</h3>
            <p>
              Records are held in the operator’s configured database. The
              proposed operational retention is 12 months for inactive
              inquiries, subject to verified legal obligations; the operator
              must approve and perform retention reviews before production.
              Deletion is not automatic. Suppression records are retained to
              honor opt-outs, and backups require a documented deletion
              schedule.
            </p>
            <h3>Your requests</h3>
            <p>
              For access, correction, or deletion, contact
              service@dmkentityllcflip.com or (678) 684-7341. We may need to
              verify your identity. Do not email sensitive identity documents
              unless a secure process has been arranged.
            </p>
            <h3>Cookies and integrations</h3>
            <p>
              A necessary, HTTP-only session cookie supports team login and
              expires after eight hours. No analytics or advertising cookies are
              installed. Live voice, calendar, and external CRM services are not
              connected. This notice and provider agreements require operator
              review before those services are enabled.
            </p>
          </>
        ) : (
          <>
            <h2>Website terms</h2>
            <p>
              This site provides general service information and inquiry intake
              for the DK Group operations described here. Using a form does not
              establish a service contract, confirmed booking, agency
              relationship, or binding property offer.
            </p>
            <h3>Quotes and service availability</h3>
            <p>
              All pricing, inventory, scheduling, material acceptance, service
              coverage, and acquisitions require individual review and written
              confirmation. Do not rely on the website to determine permit
              requirements or legal deadlines.
            </p>
            <h3>Professional advice</h3>
            <p>
              Homeowner Solutions offers consultation intake and is a service
              division. Website content and the automated receptionist are not
              legal, financial, tax, or foreclosure advice. No outcome is
              guaranteed. Consult licensed professionals about your situation.
            </p>
            <h3>Responsible use</h3>
            <p>
              Submit information you are authorized to share. Do not submit
              sensitive financial information, abuse the forms, or attempt
              unauthorized access. AI-labelled guided responses may be
              incomplete and should be confirmed with a human.
            </p>
            <h3>Contact</h3>
            <p>
              Questions about these terms can be sent to
              service@dmkentityllcflip.com or discussed at (678) 684-7341. These
              draft terms require business and legal review before production
              publication.
            </p>
          </>
        )}
      </section>
    </>
  );
}
