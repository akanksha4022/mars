import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mars from "../assets/mars.jpg";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: "This looks familiar… doesn't it?", className: "font-bebas uppercase text-5xl md:text-7xl tracking-[4px]" },
  { text: "But it's not Earth.", className: "font-inter text-lg md:text-2xl text-gray-300" },
  {
    text: (
      <>
        It's{" "}
        <span className="text-orange-500 font-bold">MARS</span>
        {" "}— wanna know about this red ball of dust?
      </>
    ),
    className: "font-inter text-lg md:text-2xl text-gray-300",
  },
];

export default function Hero() {
  const sectionRef = useRef();
  const bgRef = useRef();
  const lineRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // 🌌 Slow background zoom on scroll
      gsap.to(bgRef.current, {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 📌 Pin the section while lines reveal one by one
      // Each line gets its own "step" inside the pinned window
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          // Stay pinned for 3× the viewport height so each line has room
          end: `+=${window.innerHeight * (lines.length + 1)}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      lineRefs.current.forEach((el, i) => {
        if (!el) return;

        // Each line fades+rises in, then holds for a beat before next one
        tl.fromTo(
          el,
          { opacity: 0, y: 60, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power3.out",
          },
          // stagger each line with a gap so scrolling feels purposeful
          i * 0.8
        );
      });

      // Scroll indicator fades out after first line appears
      tl.to(
        ".scroll-indicator",
        { opacity: 0, y: -20, duration: 0.3 },
        0.4
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden text-white"
    >
      {/* 🌄 Mars Background */}
      <img
        ref={bgRef}
        src={mars}
        className="absolute w-full h-full object-cover origin-center"
        alt="Mars"
      />

      {/* 🌑 Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* ✨ Lines container */}
      <div className="relative text-center px-6 max-w-3xl space-y-6">

        {lines.map((line, i) => (
          <div
            key={i}
            ref={(el) => (lineRefs.current[i] = el)}
            // Start hidden — GSAP will animate them in
            style={{ opacity: 0 }}
            className={line.className}
          >
            {line.text}
          </div>
        ))}

        {/* ⬇️ Scroll Indicator — fades out once scrolling begins */}
        <div className="scroll-indicator flex flex-col items-center gap-1 text-sm tracking-widest opacity-70 pt-4">
          <span
            className="text-xl"
            style={{
              animation: "bounce 1.4s ease-in-out infinite",
            }}
          >
            ↓
          </span>
          <span className="uppercase text-xs tracking-[4px]">Let's Begin</span>
        </div>

      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
}