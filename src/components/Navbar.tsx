"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Wrench, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/#tools", label: "Tools" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6d5dfc] to-[#00d4aa] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6d5dfc] to-[#00d4aa] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight gradient-text leading-tight">
                SandilaDigiX
              </span>
              <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                Tools Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 ${
                  pathname === link.href
                    ? "text-white bg-white/8"
                    : "text-muted-foreground hover:text-white hover:bg-white/4"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* <a
              href="https://github.com/sandiladigix"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/4 transition-all"
            >
              <Github className="w-4.5 h-4.5" />
            </a> */}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/4 transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                    pathname === link.href
                      ? "text-white bg-white/8"
                      : "text-muted-foreground hover:text-white hover:bg-white/4"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
