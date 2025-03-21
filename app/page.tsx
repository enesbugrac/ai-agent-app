"use client";

import { useState, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FaArrowRight,
  FaFileAlt,
  FaRoad,
  FaUsers,
  FaQuestionCircle,
} from "react-icons/fa";
import Carousel from "../components/Carousel";
import Logo from "../components/Logo";
import Link from "next/link";
import landingPageBackground from "@/assets/landing-page-background.jpg";
import Image from "next/image";
import { useInView, motion, useScroll, useTransform } from "framer-motion";
import { landingAgents } from "@/data/agents";
import AgentCard from "@/components/AgentCard";
import { AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [chatInput, setChatInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();

  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: false,
    amount: 0.01,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "70% start"],
  });

  const zAxis = useTransform(
    scrollYProgress,
    [0, 1], // Input range (0 = start of section, 1 = end of section)
    ["350px", "0px"] // Output range (z-axis values)
  );

  useEffect(() => {
    if (isInView) {
      console.log("Section is in view!");
    } else {
      console.log("Section is out of view");
    }
  }, [isInView]);

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/terminal");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    // Sayfayı yeniden yüklediğimizde loading durumunu resetle
    setIsLoading(true);

    // Diğer başlangıç işlemleri...
  }, []);

  const prompts1 = [
    "Write a text asking a friend to be my plus-one at a wedding →",
    "Improve my essay writing ask me to outline my thoughts →",
    "Tell me a fun fact about the Roman Empire →",
    "Write a text inviting my neighbors to a barbecue →",
  ];

  const prompts2 = [
    "Write a Python script to automate sending daily email reports →",
    "Create a personal webpage for me after asking me three questions →",
    "Create a morning routine to boost my productivity →",
    "Plan a 'mental health day' to help me relax →",
  ];

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const PromptButton = ({ text }: { text: string }) => (
    <button className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-primary transition-colors group min-w-[300px]">
      <p className="text-white text-sm group-hover:text-black transition-colors">
        {text}
      </p>
    </button>
  );

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setIsExpanded(true);
    // Additional logic here
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1, height: "100vh" }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.8, ease: [0.76, 0.17, 0.13, 0.85] },
                opacity: { duration: 0.3, delay: 0.5 },
              },
            }}
            className="fixed inset-0 z-50 bg-[#13151a] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="logo flex items-center gap-2"
              >
                <h1 className="text-primary font-syne text-6xl font-bold">AIGEN</h1>
                <Logo withText={false} width={100} height={100} />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-secondary text-sm"
              >
                AI Powered Task Force
              </motion.span>
            </div>

            <motion.div
              className="w-full h-[30px]"
              id="progress-bar"
              exit={{
                opacity: 0,
                y: -20,
                transition: { duration: 0.3 }, // Progress bar daha hızlı kaybolacak
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: [0.76, 0.17, 0.13, 0.85] }}
                className="h-full bg-primary"
                onAnimationComplete={() => {
                  // Progress bar animasyonu tamamlandığında 0.5 saniye bekleyip kapatma
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 500);
                }}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={landingPageBackground}
          alt="landingPageBackground"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <header className="z-40 fixed top-0 left-0 right-0">
          <nav className="h-16 flex justify-between items-center px-4 max-w-7xl mx-auto">
            {/* Navigation Links */}
            <div className=" flex-1 hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-secondary hover:text-tertiary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Logo />

            {/* Auth Button */}
            <div className="flex-1 flex items-center justify-end gap-4">
              <button
                onClick={() => login()}
                className="text-sm text-black  transition-colors bg-primary px-6 py-3 rounded-lg font-medium hover:bg-white  flex items-center justify-center gap-2"
              >
                Connect Wallet
              </button>
            </div>
          </nav>
        </header>
        <div className="z-30 h-full w-[100vw] backdrop-blur-[2px] bg-black/10 relative">
          <div className="vertical-gradient-overlay"></div>
          <main className="min-h-screen flex flex-col items-center justify-center gap-16 px-4 z-50 relative max-w-full">
            <div
              className={`flex flex-col items-center justify-center gap-6 text-center transition-all duration-700 ${
                isExpanded ? "opacity-0 -translate-y-full" : ""
              }`}
            >
              <p className="z-50 text-lg text-secondary">Your AI-Powered Task Force:</p>
              <h1 className="z-50 text-[clamp(2rem,calc(2rem+2*((100vw-23.4375rem)/66.5625)),4rem)] font-semibold text-white leading-[1.1]">
                Effortlessly Solve Problems,
                <br />
                Automate Work, and Get Results.
              </h1>
              <p className="z-50 text-lg text-secondary max-w-2xl mx-auto">
                From swapping crypto to managing projects, our specialized AI agents
                handle the heavy lifting. Just ask, and watch it happen—smarter, faster,
                and hassle-free.
              </p>
              <div className="z-50 flex flex-col gap-4 justify-center items-center">
                <button
                  onClick={() => login()}
                  className="w-2/5 bg-primary text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  Start now
                  <FaArrowRight className="text-sm" />
                </button>
                <p className="text-sm text-secondary">
                  By connecting, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 transition-all duration-700 overflow-hidden">
              <Carousel slideDirection="left" className="w-full">
                {prompts1.map((prompt, index) => (
                  <PromptButton key={`left-${index}`} text={prompt} />
                ))}
              </Carousel>

              <Carousel slideDirection="right" className="w-full">
                {prompts2.map((prompt, index) => (
                  <PromptButton key={`right-${index}`} text={prompt} />
                ))}
              </Carousel>
            </div>
          </main>
        </div>

        <section className="h-[100vh] flex flex-col gap-4 items-center justify-center text-center text-white max-w-full overflow-hidden">
          <h1 className="max-w-7xl w-full h-[40%] flex items-center justify-center px-[10%] relative text-white text-4xl font-syne leading-[1.3] tracking-wide">
            <TypingText />

            <div className="curved-line absolute top-0 left-0" />
            <div className="curved-line-reverse absolute bottom-0 right-0" />
          </h1>
        </section>

        <section
          ref={sectionRef}
          className="w-full h-[100vh] flex flex-col items-center justify-center gap-10 relative overflow-hidden"
        >
          <div
            className="w-full h-[90%] flex gap-4 p-4 max-w-7xl relative"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),

                transform: useTransform(
                  scrollYProgress,
                  [0, 0.5],
                  [
                    "translate3d(0px, 0px, -200px) rotateX(13deg) rotateY(0deg) rotateZ(0deg)",
                    "translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
                  ]
                ),
              }}
              className="w-full h-full border-[1px] rounded-lg border-border absolute top-0 left-0 "
            />

            <motion.div
              style={{
                transform: useTransform(
                  scrollYProgress,
                  [0, 0.5, 0.75],
                  [
                    "translate3d(0px, 0px, 500px) rotateX(13deg) rotateY(0deg) rotateZ(0deg)",
                    "translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
                    "translate3d(0, 0, 0)",
                  ]
                ),
                opacity: useTransform(scrollYProgress, [0, 0.6], [0, 1]),
              }}
              className="w-1/4 h-full  border-r-[1px] border-border"
            >
              <header className="flex items-start justify-start p-4">
                <Logo />
              </header>
              <ul className="flex flex-col gap-4 p-4">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-secondary hover:text-tertiary transition-colors"
                  >
                    <FaFileAlt className="text-lg" />
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-secondary hover:text-tertiary transition-colors"
                  >
                    <FaRoad className="text-lg" />
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-secondary hover:text-tertiary transition-colors"
                  >
                    <FaUsers className="text-lg" />
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-secondary hover:text-tertiary transition-colors"
                  >
                    <FaQuestionCircle className="text-lg" />
                    FAQ
                  </Link>
                </li>
              </ul>
            </motion.div>

            <div
              className="w-3/4 grid grid-cols-3 gap-2 items-start justify-start"
              style={{ perspective: "1000px" }}
            >
              {landingAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  style={{
                    transform: useTransform(
                      scrollYProgress,
                      [0, 0.5, 0.75],
                      [
                        `translate3d(${agent.translate.x}px, ${agent.translate.y}px, ${agent.translate.z}px) rotateX(${agent.rotate.x}deg) rotateY(${agent.rotate.y}deg) rotateZ(${agent.rotate.z}deg)`,
                        "translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
                        "translate3d(0, 0, 0)",
                      ]
                    ),
                    opacity: useTransform(scrollYProgress, [0, 0.5], [agent.opacity, 1]),
                    scale: useTransform(scrollYProgress, [0, 0.5], [agent.scale, 1]),
                  }}
                  className="h-[200px] group"
                >
                  <AgentCard
                    description={agent.description}
                    id={agent.id}
                    name={agent.name}
                    type={agent.type}
                    icon={agent.icon}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const infoText =
  "Implementing an AI solution is not just a matter of technology. It must be an integral part of your business processes while respecting your company's culture. With Skazy AI, your AI strategy evolves in line with your ambitions.";

interface TypingTextProps {
  text?: string;
}

const TypingText = ({ text = infoText }: TypingTextProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const textRef = useRef(null);

  const words = text.split(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 } // Element %50 görünür olduğunda
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  // Kelime kelime opaklık animasyonu
  useEffect(() => {
    if (isInView && currentWordIndex < words.length) {
      const timeout = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
      }, 120); // Her kelime için 120ms bekleyelim

      return () => clearTimeout(timeout);
    }
  }, [currentWordIndex, words.length, isInView]);

  return (
    <motion.div
      ref={textRef}
      className="relative text-white text-4xl font-syne leading-[1.3] tracking-wide min-w-full min-h-[250px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full w-full">
        {words.map((word, index) => (
          <span
            key={index}
            className="mr-[0.3em] inline-block transition-all duration-300"
            style={{
              opacity: index < currentWordIndex ? 1 : 0.2,
              color: index < currentWordIndex ? "white" : "rgba(255, 255, 255, 0.5)",
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
