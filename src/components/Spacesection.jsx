import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import stars from "../assets/space.jpg"; // your star background image

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Mars – The Fourth Planet From The Sun – Is Often Called The Red Planet Due To Its Iron-Rich Surface.",
  "Cold, Dry, And Mysterious, It Has Long Fascinated Scientists And Dreamers Alike.",
];

export default function SpaceSection() {
  const sectionRef = useRef();
  const bgRef      = useRef();
  const lineRefs   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Parallax: bg moves slower than scroll (depth illusion) ──
      gsap.to(bgRef.current, {
        y: "25%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // ── Pin + type each line sequentially on scroll ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (LINES.length + 1)}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        const chars = el.querySelectorAll(".char");

        // reveal chars one by one — typewriter effect
        tl.fromTo(
          chars,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.015 * chars.length, // scale duration to word length
            stagger: 0.015,
            ease: "none",
          },
          i * 1.2  // gap between lines
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split each line into individual <span> chars for typewriter
  const splitChars = (text) =>
    text.split("").map((ch, i) => (
      <span key={i} className="char" style={{ opacity: 0 }}>
        {ch === " " ? "\u00A0" : ch}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Star background with parallax ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full"
        style={{
          top: "-25%",        // pre-offset so parallax shift stays in frame
          height: "150%",
          willChange: "transform",
        }}
      >
        <img
          src={stars}
          alt="Stars"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.85)" }}
        />
      </div>

      {/* ── Subtle vignette ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* ── Blue border glow like screenshot ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 3px rgba(80,140,255,0.35)" }}
      />

      {/* ── Typing text — centered ── */}
      <div className="relative z-20 text-center px-8 max-w-4xl space-y-8">
        {LINES.map((line, i) => (
          <p
            key={i}
            ref={(el) => (lineRefs.current[i] = el)}
            className="font-orbitron text-sm md:text-base tracking-[3px] text-white/85 leading-relaxed"
          >
            {splitChars(line)}
          </p>
        ))}
      </div>

      {/* ── Blinking cursor ── */}
      <span
        className="absolute z-20 text-white/70 font-orbitron text-base"
        style={{
          bottom: "calc(50% - 3rem)",
          animation: "blink 1s step-end infinite",
        }}
      >
        |
      </span>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
}