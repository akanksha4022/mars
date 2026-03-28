import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import earth  from "../assets/earth.png";
import rocket from "../assets/spaceshuttle.png";
import stars  from "../assets/space.jpg";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Mars – The Fourth Planet From The Sun – Is Often Called The Red Planet Due To Its Iron-Rich Surface.",
  "Cold, Dry, And Mysterious, It Has Long Fascinated Scientists And Dreamers Alike.",
];

// split text into char spans — rendered once, never re-rendered
const splitChars = (text) =>
  text.split("").map((ch, i) => (
    <span key={i} className="char" style={{ opacity: 0, display: "inline" }}>
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));

export default function LaunchToSpace() {
  const sectionRef  = useRef();
  const rocketRef   = useRef();
  const earthRef    = useRef();
  const line1Ref    = useRef();
  const line2Ref    = useRef();
  const spaceBoxRef = useRef();   // the rounded space card
  const starsBgRef  = useRef();   // parallax bg inside the card

  useEffect(() => {
    const ctx = gsap.context(() => {

      // total scroll budget: 6× vh
      // Phase 1  (0   → 1.0)  rocket launches
      // Phase 2  (1.0 → 2.2)  launch text fades in
      // Phase 3  (2.2 → 3.2)  earth fades out, space card scales in
      // Phase 4  (3.2 → 5.5)  typewriter lines type out
      // Phase 5  (5.5 → 6.0)  hold / done

      const TOTAL = window.innerHeight * 6;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${TOTAL}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // ── Phase 1: Rocket up ──────────────────────────────────────
      tl.to(rocketRef.current,
        { y: "-130vh", opacity: 0, duration: 1.0, ease: "power2.in" },
        0
      );

      // ── Phase 2: Launch text fades in ───────────────────────────
      tl.fromTo(line1Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        1.0
      );
      tl.fromTo(line2Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        1.35
      );

      // ── Phase 3a: Earth + launch text fade out ───────────────────
      tl.to([earthRef.current, line1Ref.current, line2Ref.current],
        { opacity: 0, duration: 0.6, ease: "power2.in" },
        2.2
      );

      // ── Phase 3b: Space card scales in from centre ───────────────
      tl.fromTo(spaceBoxRef.current,
        { opacity: 0, scale: 0.88, borderRadius: "40px" },
        { opacity: 1, scale: 1,    borderRadius: "24px", duration: 0.8, ease: "power3.out" },
        2.5
      );

      // ── Parallax: stars drift up as timeline progresses ──────────
      // We hook into the same scrub timeline so it feels connected
      tl.to(starsBgRef.current,
        { y: "20%", ease: "none", duration: 3.5 },
        2.5
      );

      // ── Phase 4: Typewriter — line 1 ─────────────────────────────
      const chars1 = line1Ref.current
        ? document.querySelectorAll("#typeLine1 .char")
        : [];
      const chars2 = line2Ref.current
        ? document.querySelectorAll("#typeLine2 .char")
        : [];

      if (chars1.length) {
        tl.fromTo(chars1,
          { opacity: 0 },
          { opacity: 1, stagger: 0.018, ease: "none", duration: 0.018 * chars1.length },
          3.4
        );
      }

      // ── Phase 4: Typewriter — line 2 ─────────────────────────────
      if (chars2.length) {
        tl.fromTo(chars2,
          { opacity: 0 },
          { opacity: 1, stagger: 0.018, ease: "none", duration: 0.018 * chars2.length },
          3.4 + 0.018 * chars1.length + 0.3   // starts after line 1 finishes
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white"
    >

      {/* ════════════════════════════════════════
          LAUNCH LAYER  (black bg, earth, rocket)
      ════════════════════════════════════════ */}

      {/* Earth */}
      <div
        ref={earthRef}
        className="absolute bottom-0 left-1/2 -translate-x-[57%] w-[110%] md:w-[80%] z-10"
      >
        <img
          src={earth}
          alt="Earth"
          className="w-full object-cover rounded-full"
          style={{ marginBottom: "-30%", filter: "brightness(0.75)" }}
        />
      </div>

      {/* Rocket */}
      <div
        ref={rocketRef}
        className="absolute z-30"
        style={{ bottom: "38%", left: "50%", transform: "translateX(-50%)" }}
      >
        <img
          src={rocket}
          alt="Rocket"
          className="w-28 md:w-36 object-contain"
          style={{ filter: "drop-shadow(0 0 24px rgba(255,180,80,0.25))" }}
        />
      </div>

      {/* Launch text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center space-y-4 pointer-events-none">
        <p ref={line1Ref} style={{ opacity: 0 }}
          className="font-anonymous text-sm md:text-base tracking-[6px] text-white/80">
          Leaving Earth Behind…
        </p>
        <p ref={line2Ref} style={{ opacity: 0 }}
          className="font-anonymous text-sm md:text-base tracking-[6px] text-[#F7C3A2]/80">
          Entering The Vast Unknown.
        </p>
      </div>

      {/* ════════════════════════════════════════
          SPACE CARD  (rounded, star bg, typewriter)
          starts hidden, scales in during Phase 3
      ════════════════════════════════════════ */}
      <div
        ref={spaceBoxRef}
        className="absolute inset-4 md:inset-8 z-40 overflow-hidden"
        style={{
          opacity: 0,
          borderRadius: "40px",
          
        }}
      >
        {/* Star parallax background */}
        <div
          ref={starsBgRef}
          className="absolute w-full"
          style={{ top: "-20%", height: "140%", willChange: "transform" }}
        >
          <img
            src={stars}
            alt="Stars"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.82)" }}
          />
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.78) 100%)",
          }}
        />

        {/* Typewriter lines */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 space-y-8 z-10">
          <p
            id="typeLine1"
            className="font-orbitron text-xs md:text-sm tracking-[3px] text-white/85 leading-relaxed max-w-3xl"
          >
            {splitChars(LINES[0])}
          </p>
          <p
            id="typeLine2"
            className="font-orbitron text-xs md:text-sm tracking-[3px] text-white/85 leading-relaxed max-w-3xl"
          >
            {splitChars(LINES[1])}
          </p>
        </div>

        {/* Blinking cursor */}
        <span
          className="absolute z-20 bottom-[44%] left-1/2 -translate-x-1/2 text-white/60 font-orbitron text-sm"
          style={{ animation: "blink 1s step-end infinite" }}
        >|</span>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
}