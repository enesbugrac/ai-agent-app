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
import { useAuthCache } from "@/hooks/auth.hooks";
import Header from "@/components/landing/Header";
export default function Home() {

  const { login, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push("/terminal");
    }
  }, [authenticated, router]);



  return (
    <div className="min-h-screen bg-background z-50">
      <div
        className={`transition-opacity duration-500  relative z-50 bg-[#13151a]`}
      >
        <Navbar login={login} />
        <Header />
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
