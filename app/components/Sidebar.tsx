"use client";

import Link from "next/link";
import { useState } from "react";
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
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import Image from "next/image";
import logo from "../assets/logo-background.png";

interface MenuItem {
  name: string;
  icon: IconType;
  badge?: string;
  path?: string;
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainMenu: MenuItem[] = [
    { name: "Home", icon: FaHome, path: "/" },
    {
      name: "Special Agents",
      icon: IoSparkles,
      badge: "New",
      path: "/special-agents",
    },
    { name: "Recent Threads", icon: BsChatDots, path: "/recent-threads" },
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
      } h-9 text-secondary hover:text-primary hover:bg-background-highlight rounded transition-all duration-200 relative group`}
      title={isCollapsed ? item.name : ""}
    >
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center w-full px-3" : "gap-3"
        }`}
      >
        <item.icon
          className={`text-lg transition-colors duration-200 ${
            isCollapsed ? "text-secondary group-hover:text-primary" : ""
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
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-background font-medium transition-all duration-200">
          {item.badge}
        </span>
      )}
      {item.badge && isCollapsed && (
        <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-primary transition-all duration-200" />
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
            <div className="px-3 py-2 text-[10px] font-medium text-primary/50 uppercase tracking-wider">
              Today
            </div>
            {todayMenu.map(renderMenuItem)}
          </div>

          <div className="px-2 space-y-0.5">
            <div className="px-3 py-2 text-[10px] font-medium text-primary/50 uppercase tracking-wider">
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
        <div
          className={`mt-2 ${
            isCollapsed ? "p-3" : "p-3"
          } bg-background-highlight rounded transition-all duration-200`}
        >
          <div className="flex items-center justify-center">
            <div
              className={`rounded-full bg-primary flex items-center justify-center text-background font-medium shrink-0 transition-all duration-200 ${
                isCollapsed ? "w-8 h-8 text-sm" : "w-8 h-8 text-sm"
              }`}
            >
              E
            </div>
            <div
              className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-200 ${
                isCollapsed
                  ? "w-0 opacity-0 translate-x-2"
                  : "w-auto opacity-100 translate-x-0 ml-3"
              }`}
            >
              <div className="ml-3 flex-1">
                <div className="text-primary text-sm">Emily</div>
                <div className="text-[10px] text-primary/70 hover:text-primary cursor-pointer">
                  Upgrade to Pro
                </div>
              </div>
              <button className="text-secondary hover:text-primary transition-colors">
                <FaEllipsisH className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
