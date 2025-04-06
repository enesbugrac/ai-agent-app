import Link from "next/link";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import JoinWhitelistButton from "../whitelist/JoinWhitelistButton";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useAuthCache } from "@/hooks/auth.hooks";

interface NavbarProps {
  login: () => void;
}

const Navbar = ({ login }: NavbarProps) => {
  const router = useRouter();
  const { authenticated } = usePrivy();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const {user} = useAuthCache();
  const walletAddress = user?.privyData?.wallet?.address;
  
  // Check if login was successful and redirect
  useEffect(() => {
    if (isLoggingIn && authenticated) {
      router.push('/terminal');
      setIsLoggingIn(false);
    }
  }, [isLoggingIn, authenticated, router]);
  
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLogin = () => {
    login();
    setIsLoggingIn(true);
  };

  return (
    <nav
      className={`z-40 fixed top-3 left-0 right-0 h-16 flex justify-between items-center px-4 max-w-7xl rounded-lg mx-auto transition-all duration-200 bg-[#13151a] border-[1px] border-border backdrop-blur-md shadow-md
      `}
    >
      <div className=" flex-1 hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-secondary hover:text-tertiary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Logo />

      <div className="flex-1 flex items-center justify-end gap-3">
        <JoinWhitelistButton 
          variant="outline" 
          className="text-xs px-3 py-1.5 hidden sm:flex"
        />
        {authenticated && <button onClick={() => router.push('/terminal')} className="text-black transition-colors bg-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium hover:bg-white flex items-center justify-center gap-2 text-xs">Go to App</button>}
        {walletAddress ? 
          <div className="text-xs px-3 py-1.5 hidden sm:flex text-ellipsis">
            {walletAddress.substring(0, 4)}...{walletAddress.substring(walletAddress.length - 4)}
          </div> 
          : <button
            onClick={handleLogin}
            className="text-black transition-colors bg-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium hover:bg-white flex items-center justify-center gap-2 text-xs"
          >
            Connect Wallet
          </button>}
      </div>
    </nav>
  );
};

export default Navbar;
