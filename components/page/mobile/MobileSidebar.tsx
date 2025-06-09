import React, { useMemo, useState } from "react";
import { ConfigProvider, Drawer, Dropdown, MenuProps, ThemeConfig } from "antd";
import { useMobileSidebarStore } from "../../../store/mobileBasedOperation";
import Logo from "@/components/Logo";
import Link from "next/link";

import { MdClose } from "react-icons/md";
import { FaBook, FaCheck, FaCopy, FaSignOutAlt, FaTasks, FaUser } from "react-icons/fa";
import { MenuItem } from "@/data/menuItems";
import { FaHome } from "react-icons/fa";
import { IoHeart, IoSparkles } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useThreadsStore } from "@/store/useThreadsStore";
import { BsChatDots } from "react-icons/bs";
import { useAuthCache, useAuthMutations } from "@/hooks/auth.hooks";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { colors } from "@/tailwind.config";
import { IoMdSettings } from "react-icons/io";

const MobileSidebar = () => {
  const { user } = useAuthCache();
  const { logout } = useAuthMutations();
  const { open, setOpen, loading } = useMobileSidebarStore();
  const walletAddress = user?.privyData?.wallet?.address ?? "Anonymous";
  const formattedWalletAddress = useMemo(() => {
    if (!walletAddress) return "Anonymous";
    return `${walletAddress.slice(0, 10)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  const [isCopied, setIsCopied] = useState(false);
  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(walletAddress || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  const mainMenu: MenuItem[] = [
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
      active: false,
    },
    {
      name: "Favorites",
      icon: IoHeart,
      badge: "Coming Soon",
      path: "/favorites",
      active: false,
    },
    {
      name: "Documentation",
      icon: FaBook,
      path: "https://aigen-3.gitbook.io/aigen-lab",
      active: true,
    },
  ];

  const pathname = usePathname();

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
        onClick={() => setOpen(false)}
      >
        {content}
      </Link>
    );
  };

  const threads = useThreadsStore((state) => state.threads);

  const formattedThreads = useMemo(
    () =>
      threads.map((thread) => ({
        name: thread?.name,
        icon: BsChatDots,
        path: `/thread/${thread._id}`,
      })),
    [threads]
  );

  const customTheme: ThemeConfig = {
    components: {
      Dropdown: {
        colorBgElevated: colors.background.DEFAULT,
        colorText: colors.text.primary,
      },
    },
  };

  const items: MenuProps["items"] = [
    {
      key: "address",
      label: (
        <div className="flex items-center gap-2" onClick={handleCopyAddress}>
          <span className="">
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Anonymous"}
          </span>
        </div>
      ),
      icon: isCopied ? <FaCheck color={colors.text.tertiary} /> : <FaCopy />,
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      label: <Link href="/account">Profile</Link>,
      icon: <FaUser />,
      onClick: () => {
        setOpen(false);
      },
    },
    {
      key: "settings",
      label: "Settings",
      icon: <IoMdSettings />,
      onClick: () => {
        setOpen(false);
      },
    },
    {
      key: "logout",
      label: "Logout",
      icon: <FaSignOutAlt />,
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <Drawer
      closable={false}
      destroyOnClose
      title={
        <div className="flex items-center justify-between">
          <Link href="/terminal" className="flex items-center  cursor-pointer">
            <Logo width={40} height={40} textClassName="text-xl" />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="border border-border rounded-md p-1"
          >
            <MdClose className="text-primary" size={24} />{" "}
          </button>
        </div>
      }
      placement="left"
      open={open}
      loading={loading}
      onClose={() => setOpen(false)}
      className="relative !bg-background !text-primary"
    >
      {mainMenu.map((item, index) => renderMenuItem(item, index))}

      <div className="mt-4 overflow-y-auto">
        <h1>Threads</h1>
        {formattedThreads.map((item, index) => renderMenuItem(item, index))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-background h-[72px] px-6 flex items-center justify-between border-t border-border">
        {formattedWalletAddress}
        <ConfigProvider theme={customTheme}>
          <Dropdown
            menu={{ items }}
            placement="topLeft"
            rootClassName="border rounded-md bg-background"
            overlayClassName="bg-background"
          >
            <MdOutlineMoreHoriz className="text-primary" size={24} />
          </Dropdown>
        </ConfigProvider>
      </div>
    </Drawer>
  );
};

export default MobileSidebar;
