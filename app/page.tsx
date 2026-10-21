import Link from "next/link";
import { divisions, faqs } from "@/lib/content";
import { Blueprint, DumpsterArt, KeyArt, TalkArt } from "@/components/Art";

const doors = [
  {
    key: "dumpster",
    art: <DumpsterArt />,
    lead: "Clear the space.",
    body: "Renovation debris, an eviction cleanout, a garage that finally needs emptying. Tell us what has to go and where — a team member confirms size, timing and price with you.",
    cta: "Request a quote",
  },
  {
    key: "property",
    art: <KeyArt />,
    lead: "Explore a sale.",
    body: "Inherited, vacant, fire-damaged or simply ready for a change. Start a no-obligation conversation about selling as-is, on a timeline you choose.",
    cta: "Start a conversation",
  },
  {
    key: "homeowner",
    art: <TalkArt />,
    lead: "Find your next step.",
    body: "Repairs, an inheritance, liens, relocation or a foreclosure notice. Talk it through with a person who listens first — and points you to licensed help where you need it.",
    cta: "Explore your options",
  },
] as const;

const steps = [
  [
    "Tell us your story",
    "A few details about the property or project — online, by phone, or with Ava, our AI-labelled guide.",
  ],
  [
    "Talk with a real person",
    "Someone from our Columbus team reviews your inquiry and follows up to discuss what’s possible.",
  ],
  [
    "Choose your next step",
    "Clear information, no pressure. Nothing is booked, priced or offered until you agree to it in writing.",
  ],
];

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow light" data-reveal>
            <span /> Columbus, Georgia · Three services, one team
          </p>
          <h1 id="hero-title" data-split>
            Every property.
            <br />
            Every situation.
            <br />
            <em>A way forward.</em>
          </h1>
          <p className="hero-copy" data-reveal>
            DK Group helps Columbus-area owners clear out a property with
            dumpster rentals and cleanouts, sell a house as-is, or talk through
            a difficult homeowner situation — with a real person.
          </p>
          <div className="hero-actions" data-reveal>
            <Link className="button" href="#services">
              Find your solution <span>↘</span>
            </Link>
            <a className="text-link light" href="tel:+16786847341">
              Call (678) 684-7341 <span>↗</span>
            </a>
          </div>
        </div>
        <div className="hero-art" data-reveal>
          <Blueprint />
          <p className="art-caption">
            Original illustration — not project photography
          </p>
        </div>
        <p className="hero-handoff" aria-hidden="true">
          One group. <em>Three doors.</em>
        </p>
        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </section>

      <div className="marquee" role="presentation">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <p key={copy} aria-hidden={copy === 1 ? true : undefined}>
              <span>Property-focused</span>
              <span>People-first</span>
              <span>Dumpster rentals &amp; cleanouts</span>
              <span>As-is property acquisitions</span>
              <span>Homeowner consultations</span>
              <span>No-pressure conversations</span>
            </p>
          ))}
        </div>
      </div>

      <section id="services" className="doors" aria-labelledby="doors-title">
        <div className="doors-track">
          <header className="doors-intro">
            <p className="eyebrow light">One group. Three ways to help.</p>
            <h2 id="doors-title" data-split>
              What does your next chapter need?
            </h2>
            <p data-reveal>
              Property decisions aren’t one-size-fits-all. Pick the door that
              fits — each one has its own team, its own intake form and its own
              next step.
            </p>
            <div className="doors-progress" aria-hidden="true">
              <i />
            </div>
          </header>
          {doors.map((door, i) => {
            const d = divisions[door.key];
            return (
              <article
                key={door.key}
                className={`door door-${door.key}`}
                aria-labelledby={`door-${door.key}`}
              >
                <div className="door-head">
                  <span className="door-num">0{i + 1}</span>
                  <span>{d.name}</span>
                </div>
                {door.art}
                <div className="door-copy">
                  <h3 id={`door-${door.key}`}>
                    {d.label}
                    <em>{door.lead}</em>
                  </h3>
                  <p>{door.body}</p>
                  <ul>
                    {d.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <Link className="button" href={d.href}>
                    {door.cta} <span>↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="statement" aria-label="Our approach">
        <p className="eyebrow red">More than property</p>
        <p className="statement-text" data-scrub-words>
          Sometimes you need space cleared. Sometimes you’re ready to sell. And
          sometimes you just need someone to help you think it through. Behind
          every address, there’s a person — and that’s who we talk to first.
        </p>
        <Link className="text-link" href="/about" data-reveal>
          Get to know DK Group <span>↗</span>
        </Link>
      </section>

      <section className="process" aria-labelledby="process-title">
        <div className="process-head">
          <p className="eyebrow red">How it works</p>
          <h2 id="process-title" data-split>
            Three steps.
            <br />
            <em>Your pace.</em>
          </h2>
        </div>
        <div className="process-body">
          <div className="process-rail" aria-hidden="true">
            <i />
          </div>
          <ol className="process-steps">
            {steps.map(([title, body], i) => (
              <li key={title} data-reveal>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-faq" aria-labelledby="home-faq-title">
        <div>
          <p className="eyebrow red">Straight answers</p>
          <h2 id="home-faq-title" data-split>
            Before you reach out
          </h2>
          <Link className="text-link" href="/faq">
            All questions <span>↗</span>
          </Link>
        </div>
        <div className="faqs">
          {faqs.slice(0, 4).map(([q, a]) => (
            <details key={q} data-reveal>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta-band" aria-labelledby="cta-title">
        <div className="cta-bg" data-parallax="0.2" aria-hidden="true">
          DK
        </div>
        <p className="eyebrow light">
          Let’s make the next step a little easier
        </p>
        <h2 id="cta-title" data-split>
          A conversation is a good place to start.
        </h2>
        <div className="hero-actions" data-reveal>
          <Link className="button light" href="/contact">
            Tell us what’s on your mind <span>↗</span>
          </Link>
          <a className="text-link light" href="tel:+16786847341">
            (678) 684-7341 <span>↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
