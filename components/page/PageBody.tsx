import React from "react";

interface PageBodyProps {
  children: React.ReactNode;
  className?: string;
}


const PageBody = ({ children, className }: PageBodyProps) => {
  return (
    <div className={`flex flex-col w-[80%] h-[calc(100vh-64px)] items-center  overflow-y-scroll ${className}`}>
      {children}
    </div>
  );
};

export default PageBody;
