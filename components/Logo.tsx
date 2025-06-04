'use client';

import Link from 'next/link';
import Image from "next/image";
import logo from "../public/logos/aigenlogo_png.png"

import { StaticImageData } from 'next/image';
interface LogoProps {
  width?: number;
  height?: number;
  source?: StaticImageData;
  className?: string;
  withText?: boolean;
  textClassName?: string;
}

export default function Logo({ width = 50, height = 50, source=logo, className, withText=true, textClassName }: LogoProps) {
  return (
    <Link href="/" className="flex justify-center items-center gap-3">
      <Image src={source} alt="logo" width={width} height={height} className={className} />
      {withText && <h1 className={`text-primary font-syne text-2xl font-bold ${textClassName}`}>AIGEN</h1>}
    </Link>
  );
} 