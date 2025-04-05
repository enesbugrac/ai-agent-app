import React from "react";
import landingPageBackground from "@/assets/landing2.png";
import Image from "next/image";
import Carousel from "../Carousel";
import { FaArrowRight } from "react-icons/fa";
import PromptButton from "../PromptButton";
import JoinWhitelistButton from "../whitelist/JoinWhitelistButton";

const Header = () => {
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

  return (
    <header className="z-30 h-full w-[100vw] backdrop-blur-[2px] bg-black/10 relative">
      <Image
        src={landingPageBackground}
        alt="landingPageBackground"
        className="absolute top-0 left-0 w-full h-full object-cover bg-[#13151a]"
      />
      <div className="vertical-gradient-overlay"></div>
      <main className="min-h-screen flex flex-col items-center justify-center gap-16 px-4 z-50 relative">
        <div
          className={`flex flex-col items-center justify-center gap-6 text-center transition-all duration-700`}
        >
          <p className="z-50 text-lg text-secondary">Your AI-Powered Task Force:</p>
          <h1 className="z-50 text-[clamp(2rem,calc(2rem+2*((100vw-23.4375rem)/66.5625)),4rem)] font-semibold text-white leading-[1.1]">
            Effortlessly Solve Problems,
            <br />
            Automate Work, and Get Results.
          </h1>
          <p className="z-50 text-lg text-secondary max-w-2xl mx-auto">
            From swapping crypto to managing projects, our specialized AI agents handle
            the heavy lifting. Just ask, and watch it happen—smarter, faster, and
            hassle-free.
          </p>
          <div className="z-50 flex flex-col gap-4 justify-center items-center">
            <div className="flex gap-4 w-3/5">
              <JoinWhitelistButton
                className="flex-1 py-3 text-sm flex items-center justify-center gap-2"
                text={
                  <>
                    Join the Whitelist <FaArrowRight className="text-sm" />
                  </>
                }
              />
            </div>
            <p className="text-sm text-secondary">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        <div className={`w-full flex flex-col gap-4 transition-all duration-700 `}>
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
    </header>
  );
};

export default Header;
