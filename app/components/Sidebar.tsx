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

interface MenuItem {
  name: string;
  icon: IconType;
  badge?: string;
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainMenu: MenuItem[] = [
    { name: "Home", icon: FaHome },
    { name: "Special Agents", icon: IoSparkles, badge: "New" },
    { name: "Recent Threads", icon: BsChatDots },
  ];

  const todayMenu: MenuItem[] = [
    { name: "Helpful AI Ready", icon: FaUserFriends },
    { name: "Greenhouse Effect", icon: FaCog },
  ];

  const previousMenu: MenuItem[] = [
    { name: "Web Design", icon: FaBook },
    { name: "Photo generation", icon: FaHistory },
  ];

  const bottomMenu: MenuItem[] = [
    { name: "Support", icon: FaQuestionCircle },
    { name: "Documentation", icon: FaBook },
    { name: "Changelog", icon: FaHistory, badge: "1.0.0" },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <Link
      key={item.name}
      href={`/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
      className={`flex items-center ${
        isCollapsed ? "justify-center px-5" : "justify-between px-3"
      } h-9 text-[#888] hover:text-[#F3BA2F] hover:bg-[#F3BA2F]/10 rounded transition-all duration-300 relative group`}
      title={isCollapsed ? item.name : ""}
    >
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center w-full px-3" : "gap-3"
        }`}
      >
        <item.icon
          className={`text-lg transition-all duration-500 ${
            isCollapsed ? "text-[#888] group-hover:text-[#F3BA2F]" : ""
          }`}
        />
        <span
          className={`text-sm overflow-hidden transition-all duration-500 delay-100 ${
            isCollapsed
              ? "w-0 opacity-0 translate-x-2"
              : "w-auto opacity-100 translate-x-0 delay-200"
          }`}
        >
          {item.name}
        </span>
      </div>
      {item.badge && !isCollapsed && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F3BA2F] text-black font-medium">
          {item.badge}
        </span>
      )}
      {item.badge && isCollapsed && (
        <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-[#F3BA2F]" />
      )}
    </Link>
  );

  return (
    <aside
      className={`bg-black/95 flex flex-col h-full transition-all duration-500 ease-in-out backdrop-blur-sm border-r border-[#F3BA2F]/10 ${
        isCollapsed ? "w-24" : "w-64"
      } overflow-hidden will-change-[width]`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[#F3BA2F]/10">
        <div className="flex items-center">
          <div
            className={`rounded bg-[#F3BA2F] p-[1px] shrink-0 transition-transform duration-500 ${
              isCollapsed ? "w-10 h-10" : "w-10 h-10"
            }`}
          >
            <div className="w-full h-full rounded bg-black flex items-center justify-center">
              <span
                className={`text-[#F3BA2F] font-medium transition-transform duration-500 ${
                  isCollapsed ? "text-xl" : "text-xl"
                }`}
              >
                G
              </span>
            </div>
          </div>
          <div
            className={`ml-3 transition-all duration-500 delay-100 overflow-hidden ${
              isCollapsed
                ? "w-0 opacity-0 translate-x-2"
                : "w-auto opacity-100 translate-x-0 delay-200"
            }`}
          >
            <span className="text-[#F3BA2F] text-sm font-medium whitespace-nowrap">
              Griffain
            </span>
          </div>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-[#888] hover:text-[#F3BA2F] transition-transform duration-500 ml-2 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        >
          <FaChevronLeft className="text-base" />
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-2 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin bg-black/30">
        <nav className="px-2 space-y-0.5">{mainMenu.map(renderMenuItem)}</nav>

        <div
          className={`transition-all duration-500 delay-100 transform ${
            isCollapsed
              ? "opacity-0 invisible h-0 translate-x-2"
              : "opacity-100 visible translate-x-0 delay-200"
          }`}
        >
          <div className="px-2 space-y-0.5">
            <div className="px-3 py-2 text-[10px] font-medium text-[#F3BA2F]/50 uppercase tracking-wider">
              Today
            </div>
            {todayMenu.map(renderMenuItem)}
          </div>

          <div className="px-2 space-y-0.5">
            <div className="px-3 py-2 text-[10px] font-medium text-[#F3BA2F]/50 uppercase tracking-wider">
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
      <div className="p-2 space-y-0.5 border-t border-[#F3BA2F]/10">
        {bottomMenu.map(renderMenuItem)}

        {/* User Profile */}
        <div
          className={`mt-2 ${
            isCollapsed ? "p-3" : "p-3"
          } bg-[#F3BA2F]/5 rounded transition-all duration-300`}
        >
          <div className="flex items-center justify-center">
            <div
              className={`rounded-full bg-[#F3BA2F] flex items-center justify-center text-black font-medium shrink-0 transition-all duration-300 ${
                isCollapsed ? "w-8 h-8 text-sm" : "w-8 h-8 text-sm"
              }`}
            >
              E
            </div>
            <div
              className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-500 delay-100 ${
                isCollapsed
                  ? "w-0 opacity-0 translate-x-2"
                  : "w-auto opacity-100 translate-x-0 ml-3 delay-200"
              }`}
            >
              <div className="ml-3 flex-1">
                <div className="text-[#F3BA2F] text-sm">Emily</div>
                <div className="text-[10px] text-[#F3BA2F]/70 hover:text-[#F3BA2F] cursor-pointer">
                  Upgrade to Pro
                </div>
              </div>
              <button className="text-[#888] hover:text-[#F3BA2F] transition-colors">
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
