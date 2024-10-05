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
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Mega War Game
        </Link>
        <div className="space-x-4">
          <Link href="/" className={`${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-800 dark:hover:text-blue-200`}>
            Home
          </Link>
          <Link href="/app" className={`${pathname === '/app' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-800 dark:hover:text-blue-200`}>
            App
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            className="ml-2"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </nav>
    </header>
  );
}