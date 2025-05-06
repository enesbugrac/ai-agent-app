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
  FaSignOutAlt,
  FaUser,
  FaTasks,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { useThreadsStore } from "@/store/useThreadsStore";
import { isToday } from "@/utils/date";
import { useAuthCache, useAuthMutations } from "@/hooks/auth.hooks";

interface MenuItem {
  name: string;
  icon: IconType;
  badge?: string;
  path?: string;
}

const Sidebar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthCache();

  const { logout } = useAuthMutations();
  const walletAddress = user?.privyData?.wallet?.address;

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
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainMenu: MenuItem[] = [
    { name: "Terminal", icon: FaHome, path: "/terminal" },
    {
      name: "Tasks",
      icon: FaTasks,
      path: "/tasks",
    },
    {
      name: "Special Agents",
      icon: IoSparkles,
      badge: "Coming Soon",
      path: "/special-agents",
    },
  ];

  const bottomMenu: MenuItem[] = [
    { name: "Support", icon: FaQuestionCircle, path: "/support" },
    { name: "Documentation", icon: FaBook, path: "/documentation" },
    { name: "Changelog", icon: FaHistory, badge: "1.0.0", path: "/changelog" },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => (
    <Link
      key={index + item.name}
      href={item.path || "#"}
      className={`flex items-center justify-between px-3 h-12 rounded transition-all duration-200 relative group ${
        pathname === item.path
          ? "text-primary bg-primary/10 border border-primary/20"
          : "text-white/80 hover:text-primary hover:bg-background-highlight"
      }`}
      title={item.name}
    >
      <div className="flex items-center gap-3">
        <item.icon className={`text-lg transition-colors duration-200`} />
        <span className="text-sm overflow-hidden transition-all duration-200">
          {item.name}
        </span>
      </div>
      {item.badge && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full bg-primary  text-black font-medium transition-all duration-200 ${
            pathname === item.path
          }`}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );

  return (
    <aside className="w-[20%] z-10 fixed top-0 left-0 bg-background flex flex-col h-screen transition-all duration-200 ease-in-out backdrop-blur-sm border-r border-border">
      {/* Logo */}
      <div className="flex-none">
        <Link href="/">
          <div className="h-16 flex items-center px-4 border-b border-border cursor-pointer">
            <div className="flex items-center gap-2 w-full h-full">
              <div className="logo-background flex items-center justify-center w-8 h-8">
                <span className="logo-content text-primary text-sm font-medium">A</span>
              </div>

              <div className="ml-3 transition-all duration-200 overflow-hidden">
                <span className="text-primary text-2xl font-medium whitespace-nowrap">
                  Aigen
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Menu */}
      <div className="flex flex-col h-full bg-background-overlay">
        {/* Fixed Main Nav */}
        <nav className="flex-none px-2 py-2 space-y-2">
          {mainMenu.map(renderMenuItem)}
        </nav>

        {/* Scrollable Threads */}
        <div className="flex-1 overflow-y-auto max-h-[300px] overflow-x-hidden scrollbar-thin">
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
                <span className="text-primary/80 group-hover:text-primary text-sm font-medium text-center">
                  {walletAddress?.slice(0, 2) || "A"}
                </span>
              </div>
              <div className="flex items-center justify-between flex-1 overflow-hidden transition-all duration-200 ml-3">
                <div className="ml-3 flex-1">
                  <div className="text-white text-base font-medium truncate">
                    {walletAddress
                      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                      : "Anonymous"}
                  </div>
                  <div className="text-xs text-secondary hover:text-primary cursor-pointer">
                    Upgrade to Pro
                  </div>
                </div>
              </div>
            </div>

            {/* User Menu Dropdown */}
            <div
              className={`absolute bottom-full mb-2 w-full right-0 py-2 bg-background-card backdrop-blur-sm rounded-lg border border-border shadow-xl transform transition-all duration-200 origin-bottom ${
                showUserMenu
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-2 pointer-events-none"
              }`}
            >
              <div className="px-4 py-2 border-b border-border">
                <div className="text-sm font-medium text-white truncate">
                  {walletAddress
                    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                    : "Anonymous"}
                </div>
                <div className="text-xs text-secondary mt-1">Connected Wallet</div>
              </div>

              <Link
                href="/account"
                className="w-full px-4 py-2.5 text-sm font-medium text-white hover:text-primary hover:bg-background-overlay transition-colors flex items-center gap-3"
              >
                <FaUser className="text-base" />
                Account Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2.5 text-sm font-medium text-white hover:text-primary hover:bg-background-overlay transition-colors flex items-center gap-3"
              >
                <FaSignOutAlt className="text-base" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
