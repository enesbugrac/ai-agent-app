import React from "react";

interface PageBodyProps {
  children: React.ReactNode;
  className?: string;
}


const PageBody = ({ children, className }: PageBodyProps) => {
  return (
    <div className={`flex flex-col w-[75%] items-center  pt-32 pb-16 min-h-screen  overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

export default PageBody;
