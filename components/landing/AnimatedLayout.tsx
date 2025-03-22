import { useScroll, useTransform, motion } from "framer-motion";
import AgentCard from "../AgentCard";
import { FaQuestionCircle, FaRoad, FaUsers } from "react-icons/fa";
import React, { useRef } from "react";
import Logo from "../Logo";
import Link from "next/link";
import { FaFileAlt } from "react-icons/fa";
import { landingAgents } from "@/data/agents";

const navigationLinks = [
  {
    href: "/",
    icon: FaFileAlt,
    label: "Whitepaper"
  },
  {
    href: "/",
    icon: FaRoad,
    label: "Roadmap"
  },
  {
    href: "/",
    icon: FaUsers,
    label: "Team"
  },
  {
    href: "/",
    icon: FaQuestionCircle,
    label: "FAQ"
  }
];

const AnimatedLayout = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "70% start"],
  });
  return (
    <section
      ref={sectionRef}
      className="w-full h-[100vh] flex flex-col items-center justify-center gap-10 relative"
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
            {navigationLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-secondary hover:text-tertiary transition-colors"
                >
                  <link.icon className="text-lg" />
                  {link.label}
                </Link>
              </li>
            ))}
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
                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.5],
                  [agent.opacity, 1]
                ),
                scale: useTransform(
                  scrollYProgress,
                  [0, 0.5],
                  [agent.scale, 1]
                ),
              }}
              className="group"
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
  );
};

export default AnimatedLayout;
