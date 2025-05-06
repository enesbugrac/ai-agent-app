import React from "react";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton = ({
  children,
  className,
  onClick,
  ...props
}: PrimaryButtonProps) => {
  return (
    <button
      className={`bg-primary text-black px-4 py-2 rounded-md text-sm hover:bg-primary/80 transition-all border border-border ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
