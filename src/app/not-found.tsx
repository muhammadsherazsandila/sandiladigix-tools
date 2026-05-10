"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(109,93,252,0.08),transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center px-4"
      >
        <div className="text-8xl sm:text-9xl font-extrabold gradient-text mb-4">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The tool you&apos;re looking for doesn&apos;t exist yet, or the page has moved.
          Head back home to discover all available tools.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6d5dfc] to-[#00d4aa] text-white text-sm font-semibold hover:shadow-[0_0_24px_rgba(109,93,252,0.3)] transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/#tools"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm font-medium text-muted-foreground hover:text-white transition-all"
          >
            <Search className="w-4 h-4" />
            Browse Tools
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
