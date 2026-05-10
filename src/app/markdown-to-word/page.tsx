"use client";

import { convertMarkdownToDocx } from "@/lib/markdown-to-docx";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Code,
  Columns,
  Copy,
  Download,
  Eye,
  FileDown,
  Info,
  MousePointerClick,
  PenLine,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { marked } from "marked";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

const DEFAULT_MARKDOWN = `# Hello, Welcome! 👋

Start typing your **Markdown** here and watch it come alive in the preview panel.

## How It Works

- Write or paste your Markdown on the left
- See it rendered beautifully on the right
- Click **Export to Word** — done!

## Try Some Formatting

**Bold text**, *italic text*, and \`inline code\` all work perfectly.

### A Quick List

1. Headings, paragraphs, and links
2. Tables with styled headers
3. Code blocks with syntax formatting
4. Blockquotes with accent borders

### Code Block

\`\`\`javascript
const message = "Your DOCX is one click away!";
console.log(message);
\`\`\`

### Table

| Feature | Supported |
|---------|-----------|
| Headings | ✅ |
| Bold & Italic | ✅ |
| Lists | ✅ |
| Tables | ✅ |
| Code Blocks | ✅ |

> 💡 **Tip:** Your data never leaves your browser. Everything is processed locally.

---

Ready? Hit the **Export to Word** button above! 🚀
`;

type ViewMode = "split" | "editor" | "preview";

export default function MarkdownToWordPage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [filename, setFilename] = useState("document");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Parse markdown to HTML
  const htmlContent = useMemo(() => {
    try {
      return marked.parse(markdown, { breaks: true, gfm: true }) as string;
    } catch {
      return "<p>Error parsing markdown</p>";
    }
  }, [markdown]);

  // Word count
  const stats = useMemo(() => {
    const text = markdown.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    const lines = text ? text.split("\n").length : 0;
    return { words, chars, lines };
  }, [markdown]);

  const hasContent = markdown.trim().length > 0;

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown]);

  // Export to DOCX
  const handleExport = useCallback(async () => {
    if (!markdown.trim()) return;
    setExporting(true);
    try {
      await convertMarkdownToDocx(markdown, filename || "document");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (err) {
      console.error("Export failed:", err);
    }
    setTimeout(() => setExporting(false), 1200);
  }, [markdown, filename]);

  // Import file
  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === "string") {
        setMarkdown(content);
        setFilename(file.name.replace(/\.(md|markdown|txt)$/i, ""));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  // Clear
  const handleClear = useCallback(() => {
    setMarkdown("");
    editorRef.current?.focus();
  }, []);

  // Load sample
  const handleLoadSample = useCallback(() => {
    setMarkdown(DEFAULT_MARKDOWN);
  }, []);

  // Steps data
  const steps = [
    {
      number: 1,
      icon: PenLine,
      title: "Write",
      desc: "Type or paste Markdown",
      active: true,
    },
    {
      number: 2,
      icon: Eye,
      title: "Preview",
      desc: "See live formatting",
      active: hasContent,
    },
    {
      number: 3,
      icon: FileDown,
      title: "Export",
      desc: "Download as .docx",
      active: hasContent,
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(109,93,252,0.06),transparent_70%)] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,212,170,0.04),transparent_70%)] pointer-events-none" />

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -40, x: "-50%" }}
            className="fixed top-24 left-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-green-500/15 border border-green-500/30 backdrop-blur-xl shadow-2xl"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm font-bold text-green-300">
                Exported successfully!
              </p>
              <p className="text-xs text-green-400/70 font-medium">
                Your Word document has been downloaded
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-medium"
          aria-label="breadcrumb"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-bold">Markdown to Word</span>
        </motion.nav>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggles */}
            <div className="flex items-center glass rounded-lg p-0.5">
              {[
                { mode: "split" as ViewMode, icon: Columns, label: "Split" },
                { mode: "editor" as ViewMode, icon: Code, label: "Editor" },
                { mode: "preview" as ViewMode, icon: Eye, label: "Preview" },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    viewMode === mode
                      ? "bg-[#6d5dfc] text-white shadow-md"
                      : "text-muted-foreground hover:text-white"
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleCopy}
              disabled={!hasContent}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-bold text-muted-foreground hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Copy Markdown"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-bold text-muted-foreground hover:text-white transition-all"
              title="Import a .md file from your computer"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleImport}
              className="hidden"
              id="file-import"
            />

            <button
              onClick={handleClear}
              disabled={!hasContent}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-bold text-muted-foreground hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Clear editor"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Filename */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-36 sm:w-44 px-4 py-2 rounded-lg glass text-sm font-bold text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#6d5dfc]/40"
                placeholder="filename"
                id="filename-input"
              />
              <span className="text-sm font-bold text-muted-foreground">
                .docx
              </span>
            </div>

            {/* Export Button — pulses when content is ready */}
            <button
              onClick={handleExport}
              disabled={exporting || !hasContent}
              className={`group flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-base font-bold transition-all duration-300 ${
                exporting
                  ? "bg-green-500/20 text-green-400 cursor-wait"
                  : hasContent
                    ? "bg-gradient-to-r from-[#6d5dfc] to-[#00d4aa] text-white hover:shadow-[0_0_30px_rgba(109,93,252,0.35)] hover:scale-[1.03] active:scale-[0.97] animate-pulse-glow"
                    : "bg-white/5 text-muted-foreground cursor-not-allowed"
              } disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none`}
              id="export-button"
            >
              {exporting ? (
                <>
                  <Check className="w-5 h-5" />
                  Exported!
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export to Word
                  <MousePointerClick className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Editor + Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`grid gap-4 ${
            viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
          style={{ minHeight: "calc(100vh - 24rem)" }}
        >
          {/* Editor Panel */}
          <AnimatePresence mode="wait">
            {(viewMode === "split" || viewMode === "editor") && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col rounded-2xl border border-border bg-[#0d0d15] overflow-hidden"
              >
                {/* Editor Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground ml-2">
                      <Code className="w-4 h-4 inline mr-1.5" />
                      Markdown Editor
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                    <span>{stats.words} words</span>
                    <span>{stats.chars} chars</span>
                    <span>{stats.lines} lines</span>
                  </div>
                </div>

                {/* Textarea */}
                <div className="flex-1">
                  <textarea
                    ref={editorRef}
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-full min-h-[500px] p-5 bg-transparent text-white md-editor focus:ring-0 border-none resize-none"
                    placeholder="Start typing your Markdown here..."
                    spellCheck={false}
                    id="markdown-editor"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview Panel */}
          <AnimatePresence mode="wait">
            {(viewMode === "split" || viewMode === "preview") && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col rounded-2xl border border-border overflow-hidden bg-[#0d0d15]"
              >
                {/* Preview Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground ml-2">
                      <Eye className="w-4 h-4 inline mr-1.5" />
                      Live Preview
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#00d4aa]" />
                    Real-time
                  </span>
                </div>

                {/* Preview Content or Empty State */}
                {hasContent ? (
                  <div
                    className="flex-1 p-6 overflow-y-auto min-h-[500px] markdown-preview"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    id="markdown-preview"
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-white/3 flex items-center justify-center mx-auto">
                        <Eye className="w-7 h-7 text-white/15" />
                      </div>
                      <p className="text-base font-bold text-white/20">
                        Your preview will appear here
                      </p>
                      <p className="text-sm text-muted-foreground/40 font-medium">
                        Start typing in the editor to see live results
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-start gap-3 p-5 rounded-xl glass text-sm text-muted-foreground"
        >
          <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#6d5dfc]" />
          <div className="space-y-1">
            <p>
              <strong className="text-white">Privacy First:</strong> Your
              content is processed entirely in your browser. Nothing is sent to
              any server.
            </p>
            <p>
              <strong className="text-white">Supported elements:</strong>{" "}
              Headings (H1-H6), bold, italic, lists (ordered &amp; unordered),
              code blocks, inline code, blockquotes, tables, horizontal rules,
              and links.
            </p>
          </div>
        </motion.div>

        {/* FAQ Section for SEO */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 mb-8 max-w-3xl"
        >
          <h2 className="text-2xl font-extrabold text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I convert Markdown to Word?",
                a: "Simply paste or type your Markdown content in the editor on the left, see the live preview on the right, then click 'Export to Word' to download your .docx file instantly.",
              },
              {
                q: "Is this tool free to use?",
                a: "Yes! This tool is completely free with no sign-up required. Use it as many times as you need.",
              },
              {
                q: "Is my data safe?",
                a: "Absolutely. All processing happens locally in your browser. Your content is never uploaded to any server.",
              },
              {
                q: "What Markdown features are supported?",
                a: "We support headings (H1-H6), bold, italic, ordered and unordered lists, code blocks, inline code, blockquotes, tables, horizontal rules, and links.",
              },
              {
                q: "Can I import an existing .md file?",
                a: "Yes! Click the 'Import' button in the toolbar to upload a .md, .markdown, or .txt file directly into the editor.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-base font-bold text-white hover:bg-surface transition-colors">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-6 pb-5 text-base text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "How do I convert Markdown to Word?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Simply paste or type your Markdown content in the editor, see the live preview, then click 'Export to Word' to download your .docx file instantly.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is this tool free to use?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! This tool is completely free with no sign-up required.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is my data safe?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "All processing happens locally in your browser. Your content is never uploaded to any server.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What Markdown features are supported?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We support headings (H1-H6), bold, italic, ordered and unordered lists, code blocks, inline code, blockquotes, tables, horizontal rules, and links.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I import an existing .md file?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Click the 'Import' button to upload a .md, .markdown, or .txt file directly into the editor.",
                    },
                  },
                ],
              }),
            }}
          />
        </motion.section>
      </div>
    </div>
  );
}
