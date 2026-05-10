import { Wrench, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border">
      {/* Glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#6d5dfc]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6d5dfc] to-[#00d4aa] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold gradient-text">SandilaDigiX Tools</span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed">
              Free, fast, and privacy-first online tools for developers, designers, and creators.
              No sign-up required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/markdown-to-word", label: "Markdown to Word" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-muted-foreground hover:text-white transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-base font-bold text-white mb-4">About</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              All tools run entirely in your browser. Your data never leaves your device. Built with
              Next.js and modern web technologies.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} SandilaDigiX. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> by{" "}
            <a href="https://sandiladigix.com" className="text-primary hover:text-primary/80">
              SandilaDigiX
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
