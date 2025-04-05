"use client";

import { useModalStore } from "@/store/modalStore";
import WhitelistForm from "./WhitelistForm";
import { ReactNode } from "react";

interface JoinWhitelistButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  text?: ReactNode;
}

const JoinWhitelistButton = ({ 
  className = "", 
  variant = 'primary',
  text = "Join Whitelist"
}: JoinWhitelistButtonProps) => {
  const { openModal } = useModalStore();

  const handleOpenWhitelistForm = () => {
    openModal(<WhitelistForm />);
  };

  // Generate button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return "bg-primary text-black hover:bg-primary/90";
      case 'secondary':
        return "bg-background-highlight text-white hover:bg-background-highlight/90";
      case 'outline':
        return "bg-transparent border border-primary text-primary hover:bg-primary/10";
      default:
        return "bg-primary text-black hover:bg-primary/90";
    }
  };

  return (
    <button
      onClick={handleOpenWhitelistForm}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${getButtonStyles()} ${className}`}
    >
      {text}
    </button>
  );
};

export default JoinWhitelistButton; 