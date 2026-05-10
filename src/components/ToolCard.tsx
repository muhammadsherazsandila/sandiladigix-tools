"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Tool } from "@/lib/tools-data";

interface ToolCardProps {
  tool: Tool;
  index: number;
}

export default function ToolCard({ tool, index }: ToolCardProps) {
  const Icon = tool.icon;
  const isAvailable = !tool.comingSoon;

  const cardClassName = `group relative block rounded-2xl border border-border overflow-hidden transition-all duration-300 ${
    isAvailable
      ? "hover:border-[#6d5dfc]/30 hover:shadow-[0_0_40px_rgba(109,93,252,0.08)] cursor-pointer"
      : "opacity-60 cursor-default"
  }`;

  const cardContent = (
    <>
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6d5dfc]/0 to-[#00d4aa]/0 group-hover:from-[#6d5dfc]/5 group-hover:to-[#00d4aa]/5 transition-all duration-500" />

      <div className="relative p-7 space-y-5">
        {/* Header row: icon + badges */}
        <div className="flex items-start justify-between">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex gap-2">
            {tool.isNew && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#6d5dfc]/15 text-[#8577fd] border border-[#6d5dfc]/20">
                <Sparkles className="w-3 h-3" />
                NEW
              </span>
            )}
            {tool.comingSoon && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 text-muted-foreground border border-border">
                COMING SOON
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-white group-hover:gradient-text transition-all">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-base text-muted-foreground leading-relaxed line-clamp-2">
          {tool.description}
        </p>

        {/* Category + Arrow */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {tool.category}
          </span>
          {isAvailable && (
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#6d5dfc] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
              Open Tool
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      {isAvailable ? (
        <Link href={`/${tool.slug}`} className={cardClassName}>
          {cardContent}
        </Link>
      ) : (
        <div className={cardClassName}>
          {cardContent}
        </div>
      )}
    </motion.div>
  );
}

