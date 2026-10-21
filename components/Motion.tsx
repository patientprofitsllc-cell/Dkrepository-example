"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Content is fully visible in the server HTML. The inline head script adds
// `.motion` only when JS runs and the visitor has not asked for reduced
// motion; this component then animates from the hidden states CSS sets.
export default function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("motion");
      return;
    }
    (window as Window & { __dkMotion?: boolean }).__dkMotion = true;
    root.classList.add("motion");
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -96 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      // Headline reveals. Intro headings are the LCP element, so they stay
      // painted from the first frame and only settle into place; headings
      // further down rise out of a line mask as they scroll in.
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const intro = !!el.closest(".hero, .page-hero");
        const split = SplitText.create(el, {
          type: "lines",
          mask: intro ? undefined : "lines",
          linesClass: "split-line",
        });
        splits.push(split);
        gsap.set(el, { autoAlpha: 1 });
        if (intro) {
          gsap.from(split.lines, {
            y: 34,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.08,
          });
          return;
        }
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // Above-the-fold copy plays as an intro instead of waiting for scroll.
      gsap.to(".hero [data-reveal], .page-hero [data-reveal]", {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.45,
      });

      // Generic fade-up reveals, batched so siblings stagger together.
      const below =
        "[data-reveal]:not(.hero [data-reveal]):not(.page-hero [data-reveal])";
      ScrollTrigger.batch(below, {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
          }),
      });

      // Line-art illustrations draw themselves when they enter.
      gsap.utils.toArray<SVGSVGElement>("[data-draw]").forEach((svg) => {
        const inHero = !!svg.closest(".hero");
        gsap.to(svg.querySelectorAll(".bp-line"), {
          strokeDashoffset: 0,
          duration: inHero ? 2.4 : 1.6,
          ease: "power2.inOut",
          stagger: inHero ? 0.035 : 0.06,
          delay: inHero ? 0.3 : 0,
          scrollTrigger: inHero
            ? undefined
            : { trigger: svg, start: "top 80%", once: true },
        });
      });

      // Statement copy brightens word by word as it is read.
      gsap.utils.toArray<HTMLElement>("[data-scrub-words]").forEach((el) => {
        // Words move from the muted token (still 4.5:1 on paper) to ink, so
        // the copy stays readable at every scroll position.
        const split = SplitText.create(el, { type: "words", aria: "none" });
        splits.push(split);
        gsap.fromTo(
          split.words,
          { color: "#5f645e" },
          {
            color: "#171918",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = Number(el.dataset.parallax) || 0.15;
        gsap.fromTo(
          el,
          { yPercent: depth * 100 },
          {
            yPercent: -depth * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".process-rail i").forEach((bar) => {
        gsap.to(bar, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: bar.closest(".process"),
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        });
      });

      mm.add("(min-width: 900px)", () => {
        // Hero: pinned scene — the copy lifts away, the house lights up and
        // the hand-off line arrives before the doors section.
        const hero = document.querySelector<HTMLElement>(".hero");
        if (hero) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "+=90%",
                scrub: 0.6,
                pin: true,
              },
            })
            .to(".hero-content", { yPercent: -18, autoAlpha: 0.08 }, 0)
            .to(".hero-art svg", { scale: 1.12, yPercent: -4 }, 0)
            .to(".bp-window", { opacity: 1, stagger: 0.05 }, 0.1)
            .to(".hero-glow", { opacity: 1 }, 0.1)
            .fromTo(
              ".hero-handoff",
              { autoAlpha: 0, y: 60 },
              { autoAlpha: 1, y: 0 },
              0.45,
            );
        }

        // Doors: the three divisions travel past horizontally.
        const doors = document.querySelector<HTMLElement>(".doors");
        const track = doors?.querySelector<HTMLElement>(".doors-track");
        if (doors && track) {
          const distance = () => track.scrollWidth - window.innerWidth;
          const travel = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: doors,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 0.8,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
          gsap.to(".doors-progress i", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: doors,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: true,
            },
          });
          track.querySelectorAll<HTMLElement>(".door").forEach((door) => {
            gsap.from(door.querySelectorAll(".door-art, .door-copy > *"), {
              y: 50,
              autoAlpha: 0,
              stagger: 0.06,
              ease: "power2.out",
              scrollTrigger: {
                trigger: door,
                containerAnimation: travel,
                start: "left 85%",
                end: "left 35%",
                scrub: true,
              },
            });
          });
        }
      });
    });

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      window.clearTimeout(refresh);
      mm.revert();
      ctx.revert();
      splits.forEach((s) => s.revert());
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [pathname]);
  return <div className="scroll-progress" aria-hidden="true" />;
}
