import { FaTasks, FaComments } from "react-icons/fa";

import { IconType } from "react-icons";
import { FaHome } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

export interface MenuItem {
    name: string;
    icon?: IconType;
    badge?: string;
    path?: string;
    active?: boolean;
  }

export const mainMenu: MenuItem[] = [
    { name: "Terminal", icon: FaHome, path: "/terminal", active: true },
    {
      name: "Tasks",
      icon: FaTasks,
      path: "/tasks",
      active: true,
    },
    {
      name: "Special Agents",
      icon: IoSparkles,
      badge: "Coming Soon",
      path: "/special-agents",
      active: true,
    },
    // {
    //   name: "Thread",
    //   icon: FaComments,
    //   path: "/thread",
    //   active: true,
    // },
  ];