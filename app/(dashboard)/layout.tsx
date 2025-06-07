"use client";

import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/page/PageHeader";
import PageBody from "@/components/page/PageBody";
import MobileContainer from "@/components/page/mobile/MobileContainer";
import { mainMenu } from "@/data/menuItems";
import { agents } from "@/data/agents";
import { useThreadQueryAsync } from "@/hooks/queries/thread.query";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { id } = useParams();
  const { thread } = useThreadQueryAsync();

  // Extract the first segment of the pathname (e.g. /dashboard, /thread, etc.)
  const firstPath = useMemo(() => {
    const segment = pathname.split("/").filter(Boolean)[0];
    return segment ? `/${segment}` : null;
  }, [pathname]);

  const currentMenuItem = useMemo(() => {
    return mainMenu.find((item) => item.path === firstPath);
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

  // Header logic
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
        <MobileContainer />
        <div className="w-full h-[calc(100vh-64px)] px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
