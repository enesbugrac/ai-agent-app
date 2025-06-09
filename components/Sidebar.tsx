"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { FaBook } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { useThreadsStore } from "@/store/useThreadsStore";
import { isToday } from "@/utils/date";
import Logo from "./Logo";
import { mainMenu, MenuItem } from "@/data/menuItems";

const Sidebar = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const threads = useThreadsStore((state) => state.threads);

  const todayThreads = useMemo(
    () =>
      threads
        ?.filter((thread) => isToday(thread.updatedAt || ""))
        .map((thread) => ({
          name:
            thread?.name && thread?.name?.length > 20
              ? thread?.name.slice(0, 20) + "..."
              : thread._id,
          icon: BsChatDots,
          path: `/thread/${thread._id}`,
        })),
    [threads]
  );

  const previousThreads = useMemo(
    () =>
      threads
        ?.filter((thread) => !isToday(thread.updatedAt || ""))
        .map((thread) => ({
          name:
            thread?.name && thread?.name?.length > 20
              ? thread?.name.slice(0, 20) + "..."
              : thread._id,
          icon: BsChatDots,
          path: `/thread/${thread._id}`,
        })),
    [threads]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const bottomMenu: MenuItem[] = [
    { name: "Documentation", icon: FaBook, path: "https://aigen-3.gitbook.io/aigen-lab" },
  ];

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive = item.active !== false;
    const isExternal = item.path?.startsWith("http");

    const commonClass = `flex items-center justify-between px-3 h-12 rounded transition-all duration-200 relative group ${
      pathname === item.path
        ? "text-primary bg-primary/10 border border-primary/20"
        : "text-white/80 hover:text-primary hover:bg-background-highlight"
    } ${isActive ? "cursor-pointer" : "cursor-default opacity-60"}`;

    const content = (
      <>
        <div className="flex items-center gap-3">
          {item.icon && (
            <item.icon className={`text-lg transition-colors duration-200`} />
          )}
          <span className="text-sm overflow-hidden transition-all duration-200">
            {item.name}
          </span>
        </div>
        {item.badge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-black font-medium transition-all duration-200">
            {item.badge}
          </span>
        )}
      </>
    );

    if (!isActive) {
      return (
        <div key={index + item.name} className={commonClass} title={item.name}>
          {content}
        </div>
      );
    }

    if (isExternal) {
      return (
        <a
          key={index + item.name}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className={commonClass}
          title={item.name}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        key={index + item.name}
        href={item.path || "#"}
        className={commonClass}
        title={item.name}
      >
        {content}
      </Link>
    );
  };
  return (
    <>
      {/* Sidebar for desktop and mobile */}
      <aside
        className={`
          z-30  h-screen bg-background flex flex-col transition-all duration-300 border-r border-border
          w-[20%] 
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
           md:block
        `}
        style={{ minWidth: "220px" }}
      >
        {/* Sidebar scrollable content for mobile */}
        <div className="flex flex-col h-full z-[100] relative ">
          {/* Logo */}
          <div className="flex">
            <Link
              href="/terminal"
              className="h-16 flex items-center px-4 border-b border-border cursor-pointer"
            >
              <Logo />
            </Link>
          </div>
          {/* Main Menu */}
          <div className="flex flex-col h-full h-max-screen bg-background-overlay">
            {/* Fixed Main Nav */}
            <nav className="flex-none px-2 py-2 space-y-2">
              {mainMenu.map(renderMenuItem)}
            </nav>
            {/* Scrollable Threads */}
            <div className="flex flex-col max-h-[60vh] overflow-y-auto  overflow-x-hidden scrollbar-thin">
              {todayThreads?.length > 0 && (
                <div className="px-2 space-y-0.5">
                  <div className="px-3 py-2 text-[10px] font-medium text-white/60 uppercase tracking-wider">
                    Today ({todayThreads.length})
                  </div>
                  {todayThreads.map(renderMenuItem)}
                </div>
              )}
              {previousThreads?.length > 0 && (
                <div className="px-2 space-y-0.5">
                  <div className="px-3 py-2 text-[10px] font-medium text-white/60 uppercase tracking-wider">
                    Previous 7 days ({previousThreads.length})
                  </div>
                  {previousThreads.map(renderMenuItem)}
                </div>
              )}
            </div>

            {/* Fixed Bottom Menu */}
            <div className="p-2 space-y-0.5 border-t border-border">
              {bottomMenu.map(renderMenuItem)}
            </div>
          </div>
        </div>
      </aside>
      {/* Overlay for mobile when sidebar is open */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
