import { useAuthCache, useAuthMutations } from "@/hooks/auth.hooks";
import React, { useState } from "react";
import { IconType } from "react-icons";
import WalletButton from "@/components/wallet/WalletButton";
import Link from "antd/es/typography/Link";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import Account from "../account-menu/Account";

interface PageHeaderProps {
  icon?: IconType | null;
  logo?: string | null;
  title?: string | React.ReactNode | null;
  subTitle?: string | React.ReactNode | null;
  className?: string;
}

const PageHeader = ({
  icon = null,
  logo = null,
  title,
  subTitle,
  className,
}: PageHeaderProps) => {
  const Icon = icon;
  const { user } = useAuthCache();
  const { logout } = useAuthMutations();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const walletAddress = user?.privyData?.wallet?.address;

  return (
    <div
      className={`w-full z-10 h-16 bg-background  border-b border-border  px-6 flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded bg-background flex items-center justify-center">
          {logo && <img src={logo} alt="logo" className="w-10 h-10" />}
          {Icon && <Icon className="text-primary text-lg" />}
        </div>

        <div>
          <h1 className="text-primary font-medium text-sm">{title}</h1>
          <span className="text-secondary text-xs">{subTitle}</span>
        </div>
      </div>
        <Account />
      {/* <div
        className={`absolute bottom-full mb-2 w-full right-0 py-2 bg-background-card backdrop-blur-sm rounded-lg border border-border shadow-xl transform transition-all duration-200 origin-bottom ${
          showUserMenu
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
    

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
      </div> */}
    </div>
  );
};

export default PageHeader;
