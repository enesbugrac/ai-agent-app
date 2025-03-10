"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Carousel from "../components/Carousel";
import Logo from "../components/Logo";
import Link from "next/link";
import landingPageBackground from "../app/assets/landing-page-background.jpg"
import Image from "next/image";

export default function LoginPage() {
  const [chatInput, setChatInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/terminal");
    }
  }, [ready, authenticated, router]);

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
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  const PromptButton = ({ text }: { text: string }) => (
    <button className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-primary transition-colors group min-w-[300px]">
      <p className="text-white text-sm group-hover:text-black transition-colors">{text}</p>
    </button>
  );

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setIsExpanded(true);
    // Additional logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <Image src={landingPageBackground} alt="landingPageBackground" className="absolute top-0 left-0 w-full h-full object-cover" />
    {/* Header */}
   <div className="z-50 h-full w-full backdrop-blur-[2px] bg-black/10">
   <header className="fixed top-0 left-0 right-0 z-50">
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
            <button onClick={() => login()}
            className="text-sm text-black  transition-colors bg-primary px-6 py-3 rounded-lg font-medium hover:bg-white  flex items-center justify-center gap-2"
          >
            Connect Wallet
          </button>
        </div>
      </nav>
    </header>

    {/* Main Content */}
    <main className="min-h-screen flex flex-col items-center justify-center gap-16 px-4 z-50">
      {/* Hero Section */}
      <div className={`flex flex-col items-center justify-center gap-6 text-center transition-all duration-700 ${
        isExpanded ? 'opacity-0 -translate-y-full' : ''
      }`}>
        <p className="z-50 text-lg text-secondary">
          Your AI-Powered Task Force:
        </p>
        <h1 className="z-50 text-[clamp(2rem,calc(2rem+2*((100vw-23.4375rem)/66.5625)),4rem)] font-semibold text-white leading-[1.1]">
         Effortlessly Solve Problems,
          <br />
          Automate Work, and Get Results.
        </h1>
        <p className="z-50 text-lg text-secondary max-w-2xl mx-auto">
        From swapping crypto to managing projects, our specialized AI agents handle the heavy lifting. Just ask, and watch it happen—smarter, faster, and hassle-free.
        </p>
        <div className="z-50 flex flex-col gap-4 justify-center items-center">
          <button onClick={() => login()} className="w-2/5 bg-primary text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-all flex items-center justify-center gap-2">
            Start now
            <FaArrowRight className="text-sm" />
          </button>
          <p className="text-sm text-secondary">By connecting, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
   
      {/* Example Prompts */}
      <div className={`w-full flex flex-col gap-4 transition-all duration-700 ${
        isExpanded ? 'opacity-0 -translate-y-full' : ''
      }`}>
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
  </div>
  );
}
