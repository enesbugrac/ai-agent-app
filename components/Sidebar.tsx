"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { IconType } from "react-icons";
import {
  FaHome,
  FaHistory,
  FaQuestionCircle,
  FaBook,
  FaChevronLeft,
  FaEllipsisH,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { usePrivy } from "@privy-io/react-auth";
import { useThreadsStore } from "@/store/useThreadsStore";
import { isToday, isLastWeek } from "@/utils/date";

interface MenuItem {
  name: string;
  icon: IconType;
  badge?: string;
  path?: string;
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = usePrivy();
  const pathname = usePathname();
  const threads = useThreadsStore((state) => state.threads);

  const todayThreads = useMemo(
    () =>
      threads
        ?.filter((thread) => isToday(thread.updatedAt || ""))
        .map((thread) => ({
          name: thread?.lastMessage?.content.slice(0, 20) + "..." || thread._id,
          icon: BsChatDots,
          path: `/thread/${thread._id}`,
        })),
    [threads]
  );

  const previousThreads = useMemo(
    () =>
      threads
        ?.filter((thread) => isLastWeek(thread.updatedAt || ""))
        .map((thread) => ({
          name: thread?.lastMessage?.content.slice(0, 20) + "..." || thread._id,
          icon: BsChatDots,
          path: `/thread/${thread._id}`,
        })),
    [threads]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainMenu: MenuItem[] = [
    { name: "Terminal", icon: FaHome, path: "/terminal" },
    {
      name: "Special Agents",
      icon: IoSparkles,
      badge: "New",
      path: "/special-agents",
    },
    { name: "Chat", icon: BsChatDots, path: "/chat/2" },
  ];

  const bottomMenu: MenuItem[] = [
    { name: "Support", icon: FaQuestionCircle, path: "/support" },
    { name: "Documentation", icon: FaBook, path: "/documentation" },
    { name: "Changelog", icon: FaHistory, badge: "1.0.0", path: "/changelog" },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <Link
      key={item.name}
      href={item.path || "#"}
      className={`flex items-center ${
        isCollapsed ? "justify-center" : "justify-between"
      } px-3 h-12 rounded transition-all duration-200 relative group ${
        pathname === item.path
          ? "text-primary bg-primary/10 border border-primary/20"
          : "text-white/80 hover:text-primary hover:bg-background-highlight"
      }`}
      title={isCollapsed ? item.name : ""}
    >
      <div
        className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3"}`}
      >
        <item.icon
          className={`text-lg transition-colors duration-200 ${
            isCollapsed
              ? pathname === item.path
                ? "text-primary"
                : "text-white/80 group-hover:text-primary"
              : ""
          }`}
        />
        <span
          className={`text-sm overflow-hidden transition-all duration-200 ${
            isCollapsed
              ? "w-0 opacity-0 translate-x-2"
              : "w-auto opacity-100 translate-x-0"
          }`}
        >
          {item.name}
        </span>
      </div>
      {item.badge && !isCollapsed && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-all duration-200 ${
            pathname === item.path
              ? "bg-primary/20 text-primary"
              : "bg-primary/10 text-primary/80"
          }`}
        >
          {item.badge}
        </span>
      )}
      {item.badge && isCollapsed && (
        <span
          className={`absolute -right-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
            pathname === item.path ? "bg-primary" : "bg-primary/80"
          }`}
        />
      )}
    </Link>
  );

  return (
    <aside
      className={`bg-background-card flex flex-col h-screen transition-all duration-200 ease-in-out backdrop-blur-sm border-r border-border ${
        isCollapsed ? "w-24" : "w-64"
      } overflow-hidden will-change-[width]`}
    >
      {/* Logo */}
      <div className="flex-none">
        <Link href="/">
          <div className="h-16 flex items-center px-4 border-b border-border cursor-pointer">
            <div className="flex items-center gap-2 w-full h-full">
              <div
                className={`logo-background flex items-center justify-center ${
                  isCollapsed ? "w-8 h-8" : "w-8 h-8"
                }`}
              >
                <span className="logo-content text-primary text-sm font-medium">A</span>
              </div>

              <div
                className={`ml-3 transition-all duration-200 overflow-hidden ${
                  isCollapsed
                    ? "w-0 opacity-0 translate-x-2"
                    : "w-auto opacity-100 translate-x-0"
                }`}
              >
                <span className="text-primary text-2xl font-medium whitespace-nowrap">
                  Aigen
                </span>
              </div>
            </div>
            <div className="flex-1" />
          </div>
        </Link>
      </div>

      {/* Main Menu */}
      <div className="flex flex-col h-full bg-background-overlay">
        {/* Fixed Main Nav */}
        <nav className="flex-none px-2 py-2 space-y-0.5">
          {mainMenu.map(renderMenuItem)}
        </nav>

        {/* Scrollable Threads */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <div
            className={`transition-all duration-200 transform ${
              isCollapsed
                ? "opacity-0 invisible h-0 translate-x-2"
                : "opacity-100 visible translate-x-0"
            }`}
          >
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
          {isCollapsed && (
            <div className="px-2 space-y-0.5">
              {[...todayThreads, ...previousThreads].map(renderMenuItem)}
            </div>
          )}
        </div>

        {/* Fixed Bottom Menu */}
        <div className="flex-none p-2 space-y-0.5 border-t border-border">
          {bottomMenu.map(renderMenuItem)}
          {/* User Profile */}
          <div ref={menuRef} className="relative">
            <div
              className={`mt-2 p-3 bg-background/50 hover:bg-background-overlay rounded-lg border border-border/50 transition-all duration-200 cursor-pointer group ${
                showUserMenu ? "border-primary/20" : "hover:border-primary/20"
              }`}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-background-overlay flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-primary/80 group-hover:text-primary text-sm font-medium">
                    {user?.wallet?.address.slice(0, 2) || "A"}
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-200 ${
                    isCollapsed
                      ? "w-0 opacity-0 translate-x-2"
                      : "w-auto opacity-100 translate-x-0 ml-3"
                  }`}
                >
                  <div className="ml-3 flex-1">
                    <div className="text-white text-base font-medium truncate">
                      {user?.wallet?.address
                        ? `${user.wallet.address.slice(
                            0,
                            6
                          )}...${user.wallet.address.slice(-4)}`
                        : "Anonymous"}
                    </div>
                    <div className="text-xs text-secondary hover:text-primary cursor-pointer">
                      Upgrade to Pro
                    </div>
                  </div>
                  <button className="text-secondary hover:text-primary transition-colors">
                    <FaEllipsisH className="text-sm" />
                  </button>
                </div>
              </div>
            </div>

            {/* User Menu Dropdown */}
            <div
              className={`absolute bottom-full mb-2 right-0 w-full py-2 bg-background-card backdrop-blur-sm rounded-lg border border-border shadow-xl transform transition-all duration-200 origin-bottom ${
                showUserMenu
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-2 pointer-events-none"
              }`}
            >
              <div className="px-4 py-2 border-b border-border">
                <div className="text-sm font-medium text-white">
                  {user?.wallet?.address
                    ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(
                        -4
                      )}`
                    : "Anonymous"}
                </div>
                <div className="text-xs text-secondary mt-1">Connected Wallet</div>
              </div>
              <Link
                href="/account"
                className="w-full px-4 py-3 text-sm font-medium text-left text-white hover:text-primary hover:bg-background-overlay transition-colors flex items-center gap-3"
              >
                <FaUser className="text-sm" />
                Account Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-3 text-sm font-medium text-left text-white hover:text-primary hover:bg-background-overlay transition-colors flex items-center gap-3"
              >
                <FaSignOutAlt className="text-sm" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute top-4 -right-[10px] z-10 border border-primary/50 rounded-full p-2 text-tertiary hover:text-primary transition-transform duration-200 ${
          isCollapsed ? "rotate-180" : ""
        }`}
      >
        <FaChevronLeft className="text-base" size={12} />
      </button>
    </aside>
  );
};

export default Sidebar;
