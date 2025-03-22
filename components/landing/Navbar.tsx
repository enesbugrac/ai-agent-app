import Link from "next/link";
import React from "react";
import Logo from "../Logo";

interface NavbarProps {
  login: () => void;
}

const Navbar = ({ login }: NavbarProps) => {
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];
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

      <div className="flex-1 flex items-center justify-end gap-4">
        <button
          onClick={() => login()}
          className="text-sm text-black  transition-colors bg-primary px-6 py-3 rounded-lg font-medium hover:bg-white  flex items-center justify-center gap-2"
        >
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
