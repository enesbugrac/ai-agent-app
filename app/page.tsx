"use client";

import { usePrivy } from "@privy-io/react-auth";

import "animate.css/animate.min.css";
import "animate.css";

import Pricing from "@/components/landing/Pricing";
import Navbar from "@/components/landing/Navbar";
import AnimatedLayout from "@/components/landing/AnimatedLayout";
import DescriptionSection from "@/components/landing/DescriptionSection";
import VisionAndMission from "@/components/landing/VisionAndMission";
import FeaturesSection from "@/components/landing/FeatureSection";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import AgentsOnMobile from "@/components/landing/AgentsOnMobile";
import { useEffect, useState } from "react";
import useDeviceSize from "@/hooks/useDeviceSize";

export default function Home() {
  const { login } = usePrivy();

  const {isMobile} = useDeviceSize();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full">
      <div className="transition-opacity duration-500 relative bg-[#13151a] w-full">
        <Navbar login={login} />
        <Header />
        <DescriptionSection />
        {isMobile ? <AgentsOnMobile /> : <AnimatedLayout />}
        <FeaturesSection />
        <Pricing />
        <VisionAndMission />
        <Footer />
      </div>
    </div>
  );
}
