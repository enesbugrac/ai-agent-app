"use client";

import PageHeader from "@/components/page/PageHeader";
import Sidebar from "@/components/Sidebar";
import { useAuthCache } from "@/hooks/auth.hooks";
import { useParams, usePathname, useRouter } from "next/navigation";
import { mainMenu } from "@/data/menuItems";
import { FaTasks } from "react-icons/fa";
import Page from "@/components/page/Page";
import PageBody from "@/components/page/PageBody";
import MobileContainer from "@/components/page/mobile/MobileContainer";
import { agents } from "@/data/agents";

import { useMemo } from "react";
import { useThreadQueryAsync } from "@/hooks/queries/thread.query";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const params = useParams();
  const idParam = params.id as string | undefined;
  const { thread } = useThreadQueryAsync();

  const getFirstPathSegment = (path: string): string | null => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 0 ? segments[0] : null;
  };

  const currentMenuItem = mainMenu.find(
    (item) => item.path === getFirstPathSegment(pathname)
  );

  const agent = useMemo(() => {
    return agents.find((a) => a.id === thread?.agent);
  }, [thread]);

  const threadTitle = agent?.name || "Thread";

  return (
    <div className="flex w-[100vw] ">
      {/* Desktop */}
      <div className="hidden md:flex w-full h-[100vh]">
        <Sidebar />
        <div className="w-[80%] flex-col h-full items-center justify-items-center">
        {currentMenuItem?.path != "thread" ? (
          <PageHeader
            title={currentMenuItem?.name || "Dashboard"}
            icon={currentMenuItem?.icon}
          />
        ) : (
          <PageHeader
            title={threadTitle}
            logo={agent?.logo}
            subTitle={agent?.subTitle}
          />
        )}

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
