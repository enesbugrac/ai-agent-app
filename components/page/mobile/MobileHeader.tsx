import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useMobileSidebarStore } from "../../../store/mobileBasedOperation";
import { RiMenu2Line } from "react-icons/ri";
import WalletButton from "@/components/wallet/WalletButton";
import { colors } from "@/tailwind.config";
import WalletSidebar from "@/components/wallet/WalletSidebar";

interface MobileHeaderProps {
  title: string;
  logo?: string;
  subTitle?: string;
  icon?: React.ComponentType<any>;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title, logo, subTitle, icon: Icon }) => {
  const { setOpen, setLoading } = useMobileSidebarStore();

  const handleOpenDrawer = () => {
    setOpen(true);
    setLoading(false); 
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = ()  => {
    setIsSidebarOpen(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background w-full h-16 px-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center justify-start">
        <RiMenu2Line
          className="text-primary"
          size={24}
          onClick={handleOpenDrawer}
          color={colors.primary.DEFAULT}
        />
      </div>
      <div className="flex-1 flex  justify-center gap-3">
        {logo && <img src={logo} alt="logo" className="w-10 h-10 rounded border border-border" />}
        {Icon && <Icon className="text-primary text-xl" />}
        <div className="text-left">
          <h1 className="text-primary text-sm font-medium">{title}</h1>
          {subTitle && <p className="text-secondary text-xs">{subTitle}</p>}
        </div>
      </div>
      <div
        className="flex items-center justify-end"
        onClick={handleOpenSidebar}
      >
        <WalletButton
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onlyIcon={true}
          iconProps={{ size: 24, color: colors.primary.DEFAULT }}
        />
        <WalletSidebar
          isOpen={isSidebarOpen}
          onClose={() => {
            console.log("clicked 2");
            setIsSidebarOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default MobileHeader;
