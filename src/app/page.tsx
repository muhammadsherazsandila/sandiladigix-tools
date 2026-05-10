"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Shield, Zap, Globe } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import { tools, categories } from "@/lib/tools-data";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      search === "" ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(109,93,252,0.08),transparent_70%)] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(0,212,170,0.05),transparent_70%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#6d5dfc]/20 bg-[#6d5dfc]/8 text-[#8577fd] text-sm font-bold mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Free &amp; Open Source Tools
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[1.05]"
          >
            <span className="text-white">Your Ultimate</span>
            <br />
            <span className="gradient-text">Tool Hub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Fast, free, and privacy-first online tools for developers, designers, and
            creators. Everything runs in your browser — your data never leaves your device.
          </motion.p>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {[
              { icon: Shield, label: "Privacy First" },
              { icon: Zap, label: "Lightning Fast" },
              { icon: Globe, label: "No Sign-up" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl glass text-base font-semibold text-muted-foreground"
              >
                <badge.icon className="w-5 h-5 text-[#00d4aa]" />
                {badge.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10"
          >
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass text-base font-medium text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#6d5dfc]/40 transition-all"
                id="tool-search"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#6d5dfc] text-white shadow-[0_0_16px_rgba(109,93,252,0.3)]"
                      : "glass text-muted-foreground hover:text-white hover:bg-white/6"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.slug} tool={tool} index={index} />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-xl font-semibold">No tools found matching your search.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-4 px-6 py-2.5 rounded-lg bg-[#6d5dfc]/10 text-[#8577fd] text-base font-bold hover:bg-[#6d5dfc]/20 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-10 sm:p-14 animate-pulse-glow"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5">
              More Tools Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium">
              We&apos;re constantly building new tools to make your workflow faster (and more fun).
              Stay tuned for image compressors, JSON formatters, color palette generators, and
              much more.
            </p>
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6d5dfc] to-[#00d4aa] text-white text-base font-bold animate-gradient">
              <Sparkles className="w-4 h-4" />
              Building in Public
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
