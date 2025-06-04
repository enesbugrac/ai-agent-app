import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useMobileSidebarStore } from "../../../store/mobileBasedOperation";
import { RiMenu2Line } from "react-icons/ri";
import WalletButton from "@/components/wallet/WalletButton";
import { colors } from "@/tailwind.config";
import WalletSidebar from "@/components/wallet/WalletSidebar";

const MobileHeader: React.FC = () => {
  const { setOpen, setLoading } = useMobileSidebarStore();

  const handleOpenDrawer = () => {
    setOpen(true);
    setLoading(false); // Set loading to false when opening
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  useEffect(() => {
    console.log("isSidebarOpen", isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <div className="w-full h-16 px-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center justify-start">
        <RiMenu2Line
          className="text-primary"
          size={24}
          onClick={handleOpenDrawer}
          color={colors.primary.DEFAULT}
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-primary">Agents</h1>
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
