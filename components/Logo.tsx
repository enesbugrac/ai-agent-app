'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex flex-1 justify-center items-center gap-3">
      <div className="logo-background w-8 h-8">
        <div className="logo-content w-full h-full flex items-center justify-center">
          <span className="text-primary text-lg font-medium">A</span>
        </div>
      </div>
      <span className="text-primary font-medium">Aigen</span>
    </Link>
  );
} 