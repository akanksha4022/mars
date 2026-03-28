import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mars from "../assets/mars.jpg";

gsap.registerPlugin(ScrollTrigger);

const lines = [
	{
		text: "This looks familiar… doesn't it?",
		className: "font-orbitron font-bold uppercase text-5xl md:text-4xl tracking-[4px]",
	},
	{
		text: "But it's not Earth.",
		className: "font-orbitron font-bold uppercase text-5xl md:text-4xl tracking-[4px]",
	},
	{
		text: (
			<>
				It's <span className="text-[#F7C3A2] font-orbitron font-bold uppercase text-5xl md:text-4xl tracking-[4px]">MARS</span> — wanna
				know about this red ball of dust?
			</>
		),
		className: "font-orbitron font-bold uppercase text-5xl md:text-4xl tracking-[4px]",
	},
];

export default function Hero() {
	const sectionRef = useRef();
	const bgRef = useRef();
	const lineRefs = useRef([]);
	const indicatorRef = useRef();

	useEffect(() => {
		const ctx = gsap.context(() => {

			// 🔭 Zoom-out on page load only
			gsap.fromTo(
				bgRef.current,
				{ scale: 1.08 },
				{ scale: 1.0, duration: 2, ease: "power2.out" }
			);

			// 📌 Pin the section while lines reveal one by one
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top top",
					end: `+=${window.innerHeight * (lines.length + 1)}`,
					pin: true,
					scrub: 0.5,
					anticipatePin: 1,
				},
			});

			// Step 1 — fade out indicator as scroll starts
			tl.to(indicatorRef.current, { opacity: 0, y: -20, duration: 0.3 }, 0.2);

			// Step 2 — reveal each line one by one
			lineRefs.current.forEach((el, i) => {
				if (!el) return;
				tl.fromTo(
					el,
					{ opacity: 0, y: 60, filter: "blur(6px)" },
					{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
					0.4 + i * 0.8,
				);
			});

			// Step 3 — fade indicator back in after last line is done
			tl.to(indicatorRef.current, { opacity: 0.7, y: 0, duration: 0.4 }, 0.4 + lines.length * 0.8 + 0.2);

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
			<div className="absolute inset-0 bg-black/35" />

			{/* ✨ Lines container */}
			<div className="relative text-center px-6 max-w-4xl space-y-9">
				{lines.map((line, i) => (
					<div
						key={i}
						ref={(el) => (lineRefs.current[i] = el)}
						style={{ opacity: 0 }}
						className={line.className}
					>
						{line.text}
					</div>
				))}
			</div>

			{/* ⬇️ Scroll Indicator — pinned to bottom center, independent of text block */}
			<div
				ref={indicatorRef}
				className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-sm tracking-widest opacity-70"
			>
				<span className="text-xl" style={{ animation: "bounce 1.4s ease-in-out infinite" }}>↓</span>
				<span className="uppercase text-xs tracking-[4px]">Let's Begin</span>
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