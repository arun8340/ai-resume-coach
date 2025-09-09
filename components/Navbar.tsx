'use client';

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Home, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Nav link with animated underline
  const linkClasses = (path: string) =>
    `relative block transition-colors ${
      pathname === path
        ? "text-green-600 font-semibold"
        : "text-gray-700 dark:text-gray-300 hover:text-green-600"
    } after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-green-600 after:transition-all after:duration-300 ${
      pathname === path ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Left: Logo + Brand */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-6 h-6 bg-green-500 rounded-full"></div>
          <span className="text-lg font-semibold text-green-600 group-hover:text-green-700 transition-colors">
            AI Resume Builder
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/" className={linkClasses("/")}>
            <Home className="w-4 h-4 mr-1 inline" />
            Home
          </Link>
          <Link href="/resume" className={linkClasses("/resume")}>
            Resume
          </Link>
          <Link href="/cover-letter" className={linkClasses("/cover-letter")}>
            Cover Letter
          </Link>
          <Link href="/blog" className={linkClasses("/blog")}>
            Blog
          </Link>
          <Link href="/pricing" className={linkClasses("/pricing")}>
            Pricing
          </Link>
          <Link href="/organizations" className={linkClasses("/organizations")}>
            For Organizations
          </Link>
        </nav>

        {/* Right: Theme + Auth + Mobile Menu */}
        <div className="flex items-center space-x-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          )}

          <Link
            href="/get-started"
            className="hidden md:block px-4 py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          >
            Get Started
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Side Menu */}
            <motion.div
              className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg z-50 p-6 flex flex-col space-y-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                className="self-end p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Links */}
              <nav className="flex flex-col space-y-4 text-sm font-medium">
                <Link href="/" className={linkClasses("/")} onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/resume" className={linkClasses("/resume")} onClick={() => setMenuOpen(false)}>
                  Resume
                </Link>
                <Link href="/cover-letter" className={linkClasses("/cover-letter")} onClick={() => setMenuOpen(false)}>
                  Cover Letter
                </Link>
                <Link href="/blog" className={linkClasses("/blog")} onClick={() => setMenuOpen(false)}>
                  Blog
                </Link>
                <Link href="/pricing" className={linkClasses("/pricing")} onClick={() => setMenuOpen(false)}>
                  Pricing
                </Link>
                <Link href="/organizations" className={linkClasses("/organizations")} onClick={() => setMenuOpen(false)}>
                  For Organizations
                </Link>
                <Link
                  href="/get-started"
                  className="px-4 py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
