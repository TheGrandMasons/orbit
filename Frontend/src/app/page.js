"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github } from "lucide-react";
import Image from "next/image";
import stars from "@/stars.jpg";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const router = useRouter();
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollPromptRef = useRef(null);
  const githubIconRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=1000",
        scrub: 0.5,
        onUpdate: () => {
          router.push("/model");
        },
      },
    });

    tl.to(titleRef.current, { opacity: 0, y: -200, duration: 0.5 })
      .to(subtitleRef.current, { opacity: 0, y: -500, duration: 0.5 }, "-=0.3")
      .to(scrollPromptRef.current, { opacity: 0, duration: 0.3 }, "-=0.3")
      .to(githubIconRef.current, { opacity: 0, duration: 0.3 }, "-=0.3")
      .to("body", { backgroundColor: "#000", duration: 1 });
  }, [router]);

  return (
    <div className="relative">
      <Image
        src={stars}
        alt="Starry background"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden relative">
        <a
          href="https://github.com/yourusername/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 hover:text-gray-300 transition-colors"
          ref={githubIconRef}
        >
          <Github size={24} />
        </a>
        <h1 ref={titleRef} className="text-6xl font-bold mb-4 z-10">
          ORBIT
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl mb-8 z-10 text-center max-w-2xl"
        >
          ORRERY MODEL BUILT WITH THREE.JS & NEXT.JS
        </p>
        <div ref={scrollPromptRef} className="absolute bottom-8 animate-bounce">
          <p>Scroll to enter</p>
          <svg
            className="w-6 h-6 mx-auto mt-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default LandingPage;
