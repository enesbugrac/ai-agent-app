'use client';

import Link from 'next/link';
import Image from "next/image";
import logo from "../public/logos/logo.png"
import { StaticImageData } from 'next/image';
interface LogoProps {
  width?: number;
  height?: number;
  source?: StaticImageData;
  className?: string;
  withText?: boolean;
}

export default function Logo({ width = 50, height = 50, source=logo, className, withText=true }: LogoProps) {
  return (
    <Link href="/" className="flex justify-center items-center gap-3">
      <Image src={source} alt="logo" width={width} height={height} className={className} />
      {withText && <h1 className="text-primary font-syne text-2xl font-bold">AIGEN</h1>}
    </Link>
  );
} 