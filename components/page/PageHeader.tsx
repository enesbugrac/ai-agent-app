import React from "react";
import { IconType } from "react-icons";
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
    </div>
  );
};

export default PageHeader;
