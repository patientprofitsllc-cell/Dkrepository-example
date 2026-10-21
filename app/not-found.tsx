import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section page-hero">
      <p className="eyebrow red">404</p>
      <h1>Let’s find your way.</h1>
      <p>That page isn’t here.</p>
      <Link href="/" className="button">
        Back to home ↗
      </Link>
    </section>
  );
}
