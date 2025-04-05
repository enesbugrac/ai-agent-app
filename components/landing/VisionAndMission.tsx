import React from "react";
import { useInView } from "react-intersection-observer";
import "animate.css";

const VisionAndMission = () => {
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: cardsRef, inView: cardsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const items = [
    {
      title: "Our Vision",
      description:
        "We envision a world where AI agents evolve beyond simple tools to become intelligent digital companions — intuitive, adaptive, and deeply integrated into our daily lives. Our vision is to lead the next era of human-AI collaboration, where agents not only enhance productivity and efficiency, but also inspire innovation, support decision-making, and foster creativity across every field from education and healthcare to finance and art.",
      buttonText: "Learn More",
      buttonLink: "/vision",
    },
    {
      title: "Our Mission",
      description:
        "Our mission is to create a powerful AI agent ecosystem that is accessible, secure, and deeply intelligent. We aim to simplify the use of AI for everyone — from individuals automating daily tasks to enterprises solving complex challenges. By prioritizing user-centric design, data privacy, and continuous learning, we strive to build agents that can seamlessly connect, adapt to evolving needs, and deliver transformative impact across digital landscapes.",
      buttonText: "Discover More",
      buttonLink: "/mission",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="w-full min-h-[100vh] flex flex-col items-center justify-center gap-10 relative px-4 font-syne"
    >
      <div className="w-full max-w-7xl flex flex-col gap-16">
        <h1
          className={`text-white text-9xl tracking-wide font-bold ${
            inView ? "animate__animated animate__slideInLeft" : "opacity-0"
          }`}
        >
          Vision and Mission
        </h1>

        <div ref={cardsRef} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className={`w-full h-[500px] gradient-background rounded-xl p-8 flex flex-col justify-between ${
                cardsInView ? "animate__animated animate__zoomIn" : ""
              }`}
            >
              <div>
                <h2 className="text-white text-4xl font-semibold mb-4">{item.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
              <button className="mt-6 self-start bg-[#FFDB48] text-black font-medium px-5 py-2 rounded-lg hover:opacity-90 transition">
                {item.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisionAndMission;
