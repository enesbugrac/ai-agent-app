import React from "react";

interface PageHeaderProps {
  icon?: React.ReactNode | null;
  title?: string | React.ReactNode | null;
  subTitle?: string | React.ReactNode | null;
  className?: string;
}

const PageHeader = ({
  icon = null,
  title,
  subTitle,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={`fixed top-0 right-0 z-10 w-[80%] h-16 bg-background  border-b border-border  pl-6 pr-[10%] flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded bg-background flex items-center justify-center">
          {icon}
        </div>

        <div>
          <h1 className="text-primary font-medium text-sm">{title}</h1>
          <span className="text-secondary text-xs">{subTitle}</span>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
