import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import earth from "../assets/earth.png";
import rocket from "../assets/spaceshuttle.png";

gsap.registerPlugin(ScrollTrigger);

export default function Launch() {
  const sectionRef = useRef();
  const rocketRef  = useRef();
  const earthRef   = useRef();
  const line1Ref   = useRef();
  const line2Ref   = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 3}`,  // 3× for 3 clear phases
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // ── Phase 1: Rocket launches up and disappears (t 0 → 1.0) ──
      tl.to(
        rocketRef.current,
        {
          y: "-130vh",
          opacity: 0,
          duration: 1.0,
          ease: "power2.in",
        },
        0
      );

      // ── Phase 2: Text fades in centered after rocket is gone (t 1.0 → 1.8) ──
      tl.fromTo(
        line1Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        1.0
      );
      tl.fromTo(
        line2Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        1.3
      );

      // ── Phase 3: Earth fades out at the end (t 1.8 → 2.4) ──
      tl.to(
        earthRef.current,
        {
          opacity: 0,
          y: "20%",
          duration: 0.8,
          ease: "power2.in",
        },
        1.8
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white"
    >

      {/* ── Text — absolute center, appears after rocket leaves ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center space-y-4 pointer-events-none">
        <p
          ref={line1Ref}
          style={{ opacity: 0 }}
          className="font-anonymous text-sm md:text-base tracking-[6px] text-white/80"
        >
          Leaving Earth Behind…
        </p>
        <p
          ref={line2Ref}
          style={{ opacity: 0 }}
          className="font-anonymous text-sm md:text-base tracking-[6px] text-[#F7C3A2]/80"
        >
          Entering The Vast Unknown.
        </p>
      </div>

      {/* ── Rocket — starts centered above Earth ── */}
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

      {/* ── Earth — bottom curve, fades out at end ── */}
      <div
        ref={earthRef}
        className="absolute bottom-0 left-1/2 translate-x-[-57%] w-[110%] md:w-[80%] z-10"
      >
        <img
          src={earth}
          alt="Earth"
          className="w-full object-cover rounded-full"
          style={{ marginBottom: "-30%", filter: "brightness(0.75)" }}
        />
      </div>

    </section>
  );
}