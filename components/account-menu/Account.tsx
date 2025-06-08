import React, { useState } from "react";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ConfigProvider, Dropdown, Space } from "antd";
import { FaCheck, FaChevronDown, FaSignOutAlt,  } from "react-icons/fa";
import { useAuthCache, useAuthMutations } from "@/hooks/auth.hooks";
import WalletButton from "../wallet/WalletButton";
import WalletSidebar from "../wallet/WalletSidebar";

import { FaUser, FaRegCopy,FaWallet, FaCopy } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";



import { colors } from "@/tailwind.config";
import type { ThemeConfig } from 'antd/es/config-provider/context';
import Link from "next/link";

const Account: React.FC = () => {
  const { user } = useAuthCache();
  const { logout } = useAuthMutations();
  const walletAddress = user?.privyData?.wallet?.address;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(walletAddress || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  const items: MenuProps["items"] = [
    {
      key: "address",
      label: <div className="flex items-center gap-2" onClick={handleCopyAddress}>
        <span className="">

          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Anonymous"}
        </span>
      </div>,
      icon: isCopied ? <FaCheck color={colors.text.tertiary}/> : <FaCopy />,
    },
    {
      type: "divider",
    },
    {
      key: "wallet",
      label: (
        <WalletButton
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onlyText={true}
        />
      ),
      icon: <FaWallet />,
    },
    {
      key: "profile",
      label: <Link href="/account">Profile</Link>,
      icon: <FaUser />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <IoMdSettings />,
    },
    {key: "logout", label: "Logout", icon: <FaSignOutAlt />, onClick: () => {
      logout();
    }},
  ];


  const customTheme: ThemeConfig = {
    components: {
      Dropdown: {
        colorBgElevated: colors.background.DEFAULT,
        colorText: colors.text.primary,
      },
    },
  };



  return (
    <div className="relative h-full flex items-center justify-center gap-2 ">
      <ConfigProvider theme={customTheme}>
      <Dropdown
        menu={{ items }}
        placement="bottom"
         rootClassName="border rounded-md bg-background"
         overlayClassName="bg-background"
         className="bg-primary"
      >
        <div className="flex items-center h-8 justify-center gap-2 text-sm font-medium text-white truncate border-[1px] border-border rounded-md py-2 px-2 cursor-pointer">
          {/* <Image
            src={juvex}
            alt="logo"
            width={16}
            height={16}
            className="border-[1px] border-border rounded-md"
          /> */}
          <FaUser  className="text-black" />

          <span className="text-[12px] text-black">
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Anonymous"}
          </span>
          <FaChevronDown size={12} className="text-black" />
        </div>
      </Dropdown>
      </ConfigProvider>
      <WalletSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default Account;
