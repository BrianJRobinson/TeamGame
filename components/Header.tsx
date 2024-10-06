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
    <header className="backdrop-blur-sm">
      <nav className="container sticky mx-auto px-4 py-4 flex justify-between items-center backdrop-blur-lg opacity-75">
        <Link href="/" className="text-2xl font-bold text-white-600 dark:text-white-600">
          Mega War Game
        </Link>
        <div className="space-x-4">
          <Link href="/" className={`${pathname === '/' ? 'text-red-400 dark:text-red-400' : 'text-white-600 dark:text-white-300'} hover:text-red-800 dark:hover:text-red-200`}>
            Home
          </Link>
          <Link href="/app" className={`${pathname === '/app' ? 'text-red-800 dark:text-white-400' : 'text-white-600 dark:text-white-600'} hover:text-red-800 dark:hover:text-red-200`}>
            App
          </Link>
        </div>
      </nav>
    </header>
  );
}