"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { IconType } from "react-icons";
import {
  FaHome,
  FaUserFriends,
  FaHistory,
  FaQuestionCircle,
  FaBook,
  FaCog,
  FaChevronLeft,
  FaEllipsisH,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { usePrivy } from "@privy-io/react-auth";

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

  const todayMenu: MenuItem[] = [
    {
      name: "Helpful AI Ready",
      icon: FaUserFriends,
      path: "/helpful-ai-ready",
    },
    { name: "Greenhouse Effect", icon: FaCog, path: "/greenhouse-effect" },
  ];

  const previousMenu: MenuItem[] = [
    { name: "Web Design", icon: FaBook, path: "/web-design" },
    { name: "Photo generation", icon: FaHistory, path: "/photo-generation" },
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
        isCollapsed ? "justify-center px-5" : "justify-between px-3"
      } h-9 rounded transition-all duration-200 relative group ${
        pathname === item.path
          ? "text-primary bg-primary/10 border border-primary/20"
          : "text-white/80 hover:text-primary hover:bg-background-highlight"
      }`}
      title={isCollapsed ? item.name : ""}
    >
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center w-full px-3" : "gap-3"
        }`}
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
      className={`bg-background-card flex flex-col h-full transition-all duration-200 ease-in-out backdrop-blur-sm border-r border-border ${
        isCollapsed ? "w-24" : "w-64"
      } overflow-hidden will-change-[width]`}
    >
      {/* Logo */}
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
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-secondary hover:text-primary transition-transform duration-200 ml-2 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          >
            <FaChevronLeft className="text-base" />
          </button>
        </div>
      </Link>
      {/* Main Menu */}
      <div className="flex-1 py-2 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin bg-background-overlay">
        <nav className="px-2 space-y-0.5">{mainMenu.map(renderMenuItem)}</nav>

        <div
          className={`transition-all duration-200 transform ${
            isCollapsed
              ? "opacity-0 invisible h-0 translate-x-2"
              : "opacity-100 visible translate-x-0"
          }`}
        >
          <div className="px-2 space-y-0.5">
            <div className="px-3 py-2 text-[10px] font-medium text-white/60 uppercase tracking-wider">
              Today
            </div>
            {todayMenu.map(renderMenuItem)}
          </div>

          <div className="px-2 space-y-0.5">
            <div className="px-3 py-2 text-[10px] font-medium text-white/60 uppercase tracking-wider">
              Previous 7 days
            </div>
            {previousMenu.map(renderMenuItem)}
          </div>
        </div>
        {isCollapsed && (
          <div className="px-2 space-y-0.5">
            {[...todayMenu, ...previousMenu].map(renderMenuItem)}
          </div>
        )}
      </div>

      {/* Bottom Menu */}
      <div className="p-2 space-y-0.5 border-t border-border">
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
                      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(
                          -4
                        )}`
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
    </aside>
  );
};

export default Sidebar;
