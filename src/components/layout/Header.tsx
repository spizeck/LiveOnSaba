"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Moon, Sun, User, LogOut, LayoutDashboard, Home as HomeIcon } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SITE_NAME } from "@/config/constants";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

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
            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary dark:text-primary-dark" />
                      </div>
                      <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-background-light dark:hover:bg-background-dark"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        {user.role === 'landlord' && (
                          <Link
                            href="/landlord"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-background-light dark:hover:bg-background-dark"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <HomeIcon className="h-4 w-4" />
                            Landlord Portal
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-background-light dark:hover:bg-background-dark"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Admin
                          </Link>
                        )}
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-background-light dark:hover:bg-background-dark w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/signin"
                    className="text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
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
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {user.role === 'landlord' && (
                      <Link
                        href="/landlord"
                        className="block text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Landlord Portal
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                      className="block text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className="block text-text-primary-light dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
