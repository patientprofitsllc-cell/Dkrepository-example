import Link from "next/link";
import Image from "next/image";
import { divisions } from "@/lib/content";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">
            <span /> ROOTED IN COLUMBUS, GEORGIA
          </p>
          <h1>
            Every property.
            <br />
            Every situation.
            <br />
            <em>A way forward.</em>
          </h1>
          <p className="hero-copy">
            Clear the space. Explore a sale. Find your next step.
            <br />
            Three dedicated services, one people-first approach.
          </p>
          <div className="hero-actions">
            <Link className="button" href="#services">
              Find your solution <span>↗</span>
            </Link>
            <a className="text-link" href="tel:+16786847341">
              Talk to our team <span>↗</span>
            </a>
          </div>
          <div className="hero-foot">
            <span className="line" />
            <span>
              LOCAL ROOTS.
              <br />
              <strong>REAL POSSIBILITIES.</strong>
            </span>
            <span className="hero-index">01 / 03</span>
          </div>
        </div>
        <div className="hero-art">
          <Image
            src="/architecture.svg"
            alt="Architectural illustration of a modern home surrounded by greenery"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <div className="image-label">
            <span>THE NEXT CHAPTER STARTS HERE</span>
            <span>↗</span>
          </div>
          <div className="art-caption">AN ILLUSTRATION OF POSSIBILITY</div>
        </div>
      </section>
      <div className="value-bar">
        <span>Property-focused. People-first.</span>
        <span>Three connected services</span>
        <span>Columbus, GA & nearby communities*</span>
        <span>No-pressure conversations ↗</span>
      </div>
      <section id="services" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow red">ONE GROUP. THREE WAYS TO HELP.</p>
            <h2>
              What does your
              <br />
              next chapter need?
            </h2>
          </div>
          <p>
            Property decisions aren’t one-size-fits-all.
            <br />
            Start with what matters to you. We’ll take it from there.
          </p>
        </div>
        <div className="service-grid">
          {Object.entries(divisions).map(([key, d], i) => (
            <Link
              className={`service-card service-${key}`}
              href={d.href}
              key={key}
            >
              <div className="card-top">
                <span>0{i + 1}</span>
                <span className="card-symbol">
                  {i === 0 ? "▱" : i === 1 ? "⌂" : "✳"}
                </span>
              </div>
              <p className="eyebrow">{d.name}</p>
              <h3>{d.label}</h3>
              <p>
                {i === 0
                  ? "A cleaner space for a fresh beginning. Rental and cleanout inquiries, made simple."
                  : i === 1
                    ? "A new path for a property you’re ready to move on from. Let’s explore the possibilities."
                    : "A listening ear and a clearer next step when property decisions feel overwhelming."}
              </p>
              <div className="card-link">
                {i === 0
                  ? "Request a quote"
                  : i === 1
                    ? "Start a conversation"
                    : "Explore your options"}
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="fine-print">
          *Coverage and availability are confirmed for your address before any
          service is booked.
        </p>
      </section>
      <section className="approach section">
        <div>
          <p className="eyebrow red">MORE THAN PROPERTY</p>
          <h2>
            Behind every address,
            <br />
            there’s a <em>person.</em>
          </h2>
          <p>
            Sometimes you need space cleared. Sometimes you’re ready to sell.
            And sometimes you just need someone to help you think things
            through.
          </p>
          <p>
            We bring practical service and thoughtful conversations together, so
            you can move forward with more clarity.
          </p>
          <Link className="text-link" href="/about">
            Get to know DK Group <span>↗</span>
          </Link>
        </div>
        <div className="steps">
          {[
            [
              "01",
              "Tell us your story",
              "Start with a few details about your property or project.",
            ],
            [
              "02",
              "Talk with a real person",
              "Our team reviews your inquiry and discusses what’s possible.",
            ],
            [
              "03",
              "Choose your next step",
              "Get clear information. Decide at your own pace.",
            ],
          ].map(([n, t, p]) => (
            <div key={n}>
              <span>{n}</span>
              <section>
                <h3>{t}</h3>
                <p>{p}</p>
              </section>
            </div>
          ))}
        </div>
      </section>
      <section className="cta-band">
        <p className="eyebrow">LET’S MAKE THE NEXT STEP A LITTLE EASIER.</p>
        <h2>A conversation is a good place to start.</h2>
        <Link className="button light" href="/contact">
          Tell us what’s on your mind <span>↗</span>
        </Link>
      </section>
    </>
  );
}
