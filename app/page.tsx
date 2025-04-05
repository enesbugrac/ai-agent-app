"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Logo from "../components/Logo";

import { motion } from "framer-motion";

import { AnimatePresence } from "framer-motion";

import "animate.css/animate.min.css";
import Footer from "@/components/landing/Footer";
import Pricing from "@/components/landing/Pricing";
import Navbar from "@/components/landing/Navbar";
import AnimatedLayout from "@/components/landing/AnimatedLayout";
import DescriptionSection from "@/components/landing/DescriptionSection";
import VisionAndMission from "@/components/landing/VisionAndMission";
import FeaturesSection from "@/components/landing/FeatureSection";
import { useAuth } from "@/hooks/auth.hooks";
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);

  const { login } = usePrivy();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/terminal");
    }
  }, [user, router]);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <div className="min-h-screen bg-background z-50">
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
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: [0.76, 0.17, 0.13, 0.85] }}
                className="h-full bg-primary"
                onAnimationComplete={() => {
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
        } relative z-50 bg-[#13151a]`}
      >
        <Navbar login={login} />
        <DescriptionSection />
        <AnimatedLayout />
        <FeaturesSection />
        <Pricing />
        <VisionAndMission />
        <Footer />
      </div>
    </div>
  );
}
