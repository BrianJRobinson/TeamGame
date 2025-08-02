"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/30 dark:bg-black/30">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="md:text-2xl font-bold text-white-600 dark:text-white-600">
          Mega War Game
        </Link>
        <div className="space-x-4">
        <div className="space-x-4">
        <Link
          href="/"
          className={`font-semibold transition-transform duration-200 hover:scale-110
            ${pathname === '/' ? 'font-black text-black' : 'font-normal text-black'}
            hover:text-orange-500`}
        >
          Home
        </Link>
        <Link
          href="/app"
          className={`font-semibold transition-transform duration-200 hover:scale-110
            ${pathname === '/app' ? 'font-black text-black' : 'font-normal text-black'}
            hover:text-orange-500`}
        >
          App
        </Link>
      </div>
        </div>
      </nav>
    </header>
  );
}