import { Drawer } from "antd";
import React from "react";
import MobileSidebar from "./MobileSidebar";
import MobileHeader from "./MobileHeader";

const MobileContainer = () => {
  return (
    <>
      <MobileHeader />
      <MobileSidebar />
    </>
  );
};

export default MobileContainer;
