"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../public/logos/aigenlogo_png.png";
import { StaticImageData } from "next/image";
interface LogoProps {
  width?: number;
  height?: number;
  source?: StaticImageData;
  className?: string;
  withText?: boolean;
  textClassName?: string;
}

export default function Logo({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  width = 50,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  height = 50,
  source = logo,
  className,
  withText = true,
  textClassName,
}: LogoProps) {
  return (
    <Link href="/" className="flex justify-center items-center gap-3">
      <Image
        src={source}
        alt="logo"
        className={`md:w-12 md:h-12 w-10 h-10 ${className}`}
      />
      {withText && (
        <h1
          className={`text-primary font-syne md:text-2xl text-xl font-bold ${textClassName}`}
        >
          AIGEN
        </h1>
      )}
    </Link>
  );
}
