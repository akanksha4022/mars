import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mars from "../assets/mars.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ✨ Text reveal animation
      gsap.from(".line", {
        opacity: 0,
        y: 80,
        stagger: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        },
      });

      // 🌌 Background slow zoom
      gsap.to(".bg", {
        scale: 1.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

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
        src={mars}
        className="bg absolute w-full h-full object-cover"
        alt="Mars"
      />

      {/* 🌑 Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* ✨ Content */}
      <div className="relative text-center px-6 max-w-3xl font-orbitron">

        <h1 className="line uppercase text-5xl md:text-7xl tracking-[4px] mb-4">
          This looks familiar… doesn't it?
        </h1>

        <p className="line font-inter text-lg md:text-xl text-gray-300 mb-2">
          But it's not Earth.
        </p>

        <p className="line font-inter text-lg md:text-xl text-gray-300 mb-8">
          It's Mars — wanna know about 
        </p>

        <p className="line font-inter text-lg md:text-xl text-gray-300 mb-8">
          this red ball of dust?
        </p>

        {/* ⬇️ Scroll Indicator */}
        <div className="line flex flex-col items-center gap-2 text-sm tracking-wider opacity-80">
          <span className="animate-bounce text-xl">↓</span>
          <span>Begin the Mission</span>
        </div>

      </div>
    </section>
  );
}