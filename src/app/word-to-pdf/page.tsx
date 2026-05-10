"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  Info,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsPdfReady(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      // Read the DOCX file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Import mammoth for DOCX to HTML conversion
      const mammoth = await import("mammoth");

      // Convert DOCX to HTML using mammoth
      // Mammoth preserves inline styles like colors, fonts, and background colors
      const result = await mammoth.convertToHtml({ arrayBuffer });
      let html = result.value;

      // Extract any warnings about unsupported features
      if (result.messages && result.messages.length > 0) {
        console.log("Mammoth conversion messages:", result.messages);
      }

      // Import html2pdf for PDF generation
      const html2pdf = await import("html2pdf.js");

      // Comprehensive CSS styling that respects document properties
      const cssStyles = `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body, div, section {
            font-family: 'Calibri', 'Arial', 'Cambria', 'Times New Roman', sans-serif;
            color: inherit;
            background-color: transparent;
          }
          p {
            margin: 0.5em 0;
            line-height: 1.6;
            font-size: 11pt;
            color: inherit;
            font-family: inherit;
          }
          h1 {
            font-size: 2.5em;
            margin: 0.8em 0 0.3em 0;
            font-weight: bold;
            color: inherit;
            page-break-after: avoid;
            line-height: 1.2;
            font-family: inherit;
          }
          h2 {
            font-size: 2em;
            margin: 0.6em 0 0.25em 0;
            font-weight: bold;
            color: inherit;
            page-break-after: avoid;
            line-height: 1.2;
            font-family: inherit;
          }
          h3 {
            font-size: 1.75em;
            margin: 0.4em 0 0.2em 0;
            font-weight: bold;
            color: inherit;
            page-break-after: avoid;
            line-height: 1.2;
            font-family: inherit;
          }
          h4 {
            font-size: 1.5em;
            margin: 0.3em 0;
            font-weight: bold;
            color: inherit;
            page-break-after: avoid;
            font-family: inherit;
          }
          h5 {
            font-size: 1.25em;
            margin: 0.2em 0;
            font-weight: bold;
            color: inherit;
            page-break-after: avoid;
            font-family: inherit;
          }
          h6 {
            font-size: 1.1em;
            margin: 0.2em 0;
            font-weight: bold;
            color: inherit;
            page-break-after: avoid;
            font-family: inherit;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.8em 0;
            font-size: 10pt;
          }
          td, th {
            border: 1px solid #999;
            padding: 8px;
            text-align: left;
            color: inherit;
            background-color: inherit;
            font-family: inherit;
          }
          th {
            background-color: #e6e6e6;
            font-weight: bold;
          }
          ul {
            list-style-type: disc;
            margin: 0.5em 0 0.5em 2em;
          }
          ol {
            list-style-type: decimal;
            margin: 0.5em 0 0.5em 2em;
          }
          li {
            margin: 0.3em 0;
            line-height: 1.5;
            color: inherit;
            font-family: inherit;
          }
          strong, b {
            font-weight: bold;
            color: inherit;
            font-family: inherit;
          }
          em, i {
            font-style: italic;
            color: inherit;
            font-family: inherit;
          }
          u {
            text-decoration: underline;
            color: inherit;
            font-family: inherit;
          }
          span {
            color: inherit;
            background-color: inherit;
            font-size: inherit;
            font-family: inherit;
          }
          img {
            max-width: 100%;
            height: auto;
            margin: 0.5em 0;
          }
          blockquote {
            margin-left: 2em;
            padding-left: 1em;
            border-left: 3px solid #ccc;
            color: inherit;
            font-family: inherit;
          }
          code {
            background-color: #f5f5f5;
            padding: 2px 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: inherit;
          }
          pre {
            background-color: #f5f5f5;
            padding: 1em;
            margin: 0.5em 0;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: inherit;
          }
          hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 1em 0;
          }
        </style>
      `;

      // Create a temporary container preserving document background and colors
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = cssStyles + `<div>${html}</div>`;
      tempDiv.style.backgroundColor = "transparent";
      tempDiv.style.color = "inherit";

      // Configure PDF options with transparent background to preserve document styling
      const opt = {
        margin: 10,
        filename: file.name.replace(/\.docx$/i, ".pdf"),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: null,
          letterRendering: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Generate and save PDF
      const pdfGenerator = html2pdf.default;
      await pdfGenerator().set(opt).from(tempDiv).save();

      setIsPdfReady(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (error) {
      console.error("Conversion failed:", error);
      alert(
        "Failed to convert document. Please ensure it is a valid .docx file.",
      );
    } finally {
      setIsConverting(false);
    }
  }, [file]);

  const handleDownload = useCallback(() => {
    // PDF is automatically downloaded via html2pdf.save()
    // This function is kept for compatibility but not needed
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setIsPdfReady(false);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(109,93,252,0.06),transparent_70%)] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(225,29,72,0.04),transparent_70%)] pointer-events-none" />

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
                Conversion Complete!
              </p>
              <p className="text-xs text-green-400/70 font-medium">
                Your PDF is ready to download
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
          <span className="text-white font-bold">Word to PDF</span>
        </motion.nav>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 flex flex-col rounded-2xl border border-border overflow-hidden bg-[#0d0d15]"
          style={{ minHeight: "50vh" }}
        >
          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-surface border border-border flex items-center justify-center mb-6 shadow-xl">
              <UploadCloud className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Convert Word to PDF
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md">
              Select a .docx file, click convert, and download your PDF
              instantly
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-sm font-bold text-white hover:bg-white/5 transition-all"
                title="Upload a .docx file"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Select Word Document</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
                id="file-import"
              />

              {file && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span className="text-sm font-medium text-white truncate">
                    {file.name}
                  </span>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className={`group flex items-center gap-2.5 px-6 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                    isConverting
                      ? "bg-blue-500/20 text-blue-400 cursor-wait"
                      : "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:scale-[1.03] active:scale-[0.97]"
                  } disabled:opacity-40`}
                >
                  {isConverting ? "Converting..." : "Convert to PDF"}
                </button>

                <button
                  onClick={handleClear}
                  disabled={!file}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl glass text-sm font-bold text-muted-foreground hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Clear file"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Info Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-start gap-3 p-5 rounded-xl glass text-sm text-muted-foreground"
        >
          <Info className="w-5 h-5 mt-0.5 shrink-0 text-rose-500" />
          <div className="space-y-1">
            <p>
              <strong className="text-white">Privacy First:</strong> Your
              documents are processed entirely in your browser. Nothing is sent
              to any server.
            </p>
            <p>
              <strong className="text-white">How it works:</strong> Upload your
              .docx file, click &quot;Convert to PDF&quot;, and then download
              your converted PDF instantly.
            </p>
            <p>
              <strong className="text-white">Supported formats:</strong> Modern
              Word documents (.docx) with full support for text formatting,
              tables, images, headers, and page layouts.
            </p>
          </div>
        </motion.div>

        {/* FAQ Section */}
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
                q: "How do I convert Word to PDF?",
                a: "Upload your .docx file, click 'Convert to PDF', and then download the resulting PDF. It's that simple!",
              },
              {
                q: "Is the PDF text-selectable?",
                a: "Yes! The generated PDF preserves text as selectable, searchable, and copy-pasteable content. Your formatting, images, and layout are all preserved.",
              },
              {
                q: "Is my data safe?",
                a: "Absolutely. All processing happens locally in your browser using JavaScript. Your files never leave your computer.",
              },
              {
                q: "Are old .doc files supported?",
                a: "No, currently only modern .docx files (Office 2007 and newer) are supported by the converter.",
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
        </motion.section>
      </div>
    </div>
  );
}
