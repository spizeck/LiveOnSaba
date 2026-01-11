"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SITE_NAME } from "@/config/constants";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-surface-dark">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary dark:text-primary-dark">
                {SITE_NAME}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/listings"
              className="text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
            >
              Browse Listings
            </Link>
            <Link
              href="/auth/signin"
              className="text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-text-primary-light" />
              ) : (
                <Sun className="h-5 w-5 text-text-primary-dark" />
              )}
            </button>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-text-primary-light" />
              ) : (
                <Sun className="h-5 w-5 text-text-primary-dark" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-text-primary-light dark:text-text-primary-dark" />
              ) : (
                <Menu className="h-6 w-6 text-text-primary-light dark:text-text-primary-dark" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/listings"
              className="block text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Listings
            </Link>
            <Link
              href="/auth/signin"
              className="block text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
