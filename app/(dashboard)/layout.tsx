"use client";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/page/PageHeader";
import PageBody from "@/components/page/PageBody";
import { FaHome, FaTasks, FaBook, FaComments, FaUser } from "react-icons/fa";
import { IoHeart, IoSparkles } from "react-icons/io5";
import { agents } from "@/data/agents";
import {  useCurrentThreadCache } from "@/hooks/queries/thread.query";
import MobileSidebar from "@/components/page/mobile/MobileSidebar";
import MobileHeader from "@/components/page/mobile/MobileHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { thread } = useCurrentThreadCache();

  const pages = [
    {
      name: "Terminal",
      icon: FaHome,
      path: "/terminal",
    },
    {
      name: "Tasks",
      icon: FaTasks,
      path: "/tasks",
    },
    {
      name: "Special Agents",
      icon: IoSparkles,
      path: "/special-agents",
    },
    {
      name: "Favorites",
      icon: IoHeart,
      path: "/favorites",
    },
    {
      name: "Documentation",
      icon: FaBook,
      path: "https://aigen-3.gitbook.io/aigen-lab",
    },
    {
      name: "Thread",
      icon: FaComments,
      path: "/thread",
    },
    {
      name: "Account",
      icon: FaUser,
      path: "/account",
    },
  ];

  // Extract the first segment of the pathname (e.g. /dashboard, /thread, etc.)
  const firstPath = useMemo(() => {
    const segment = pathname.split("/").filter(Boolean)[0];
    return segment ? `/${segment}` : null;
  }, [pathname]);

  const currentMenuItem = useMemo(() => {
    return pages.find((item) => item.path === firstPath);
  }, [firstPath]);

  const threadAgent = useMemo(() => {
    return agents.find((agent) => agent.id === thread?.agent);
  }, [thread]);

  // Check if the route is an agent-specific page and extract agent info
  const isAgentPage = useMemo(() => pathname.startsWith("/agent/"), [pathname]);
  const agentFromPath = useMemo(() => {
    if (!isAgentPage) return null;
    const agentId = pathname.split("/")[2];
    return agents.find((agent) => agent.id === agentId);
  }, [pathname, isAgentPage]);

  // Header logic for desktop
  const headerProps = useMemo(() => {
    if (currentMenuItem && !isAgentPage && firstPath !== "/thread") {
      return {
        title: currentMenuItem.name,
        icon: currentMenuItem.icon,
      };
    }

    const agentData = isAgentPage ? agentFromPath : threadAgent;
    return {
      title: agentData?.name || "Thread",
      logo: agentData?.logo,
      subTitle: agentData?.subTitle,
    };
  }, [currentMenuItem, threadAgent, agentFromPath, isAgentPage, firstPath]);

  // Header logic for mobile

  return (
    <div className="flex w-full">
      {/* Desktop */}
      <div className="hidden md:flex w-full h-screen">
        <Sidebar />
        <div className="w-[80%] flex-col h-full items-center justify-items-center">
          <PageHeader {...headerProps} />
          <PageBody>{children}</PageBody>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full">
        <MobileHeader {...headerProps} />
        <MobileSidebar />
        <div className="w-full h-[100vh] px-4 pt-[calc(64px+1rem)] pb-1">{children}</div>
      </div>
    </div>
  );
}
