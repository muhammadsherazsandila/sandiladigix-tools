"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Info,
  MousePointerClick,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const docxBlobRef = useRef<Blob | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsConverting(true);
    setIsRendered(false);

    try {
      // Dynamically import docx-preview (client-side only)
      const docxPreview = await import("docx-preview");

      const arrayBuffer = await selectedFile.arrayBuffer();
      const blob = new Blob([arrayBuffer]);
      docxBlobRef.current = blob;

      // Clear previous preview
      if (previewContainerRef.current) {
        previewContainerRef.current.innerHTML = "";
      }

      // Render the DOCX into the preview container
      await docxPreview.renderAsync(blob, previewContainerRef.current!, undefined, {
        className: "docx",
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: true,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: true,
      });

      setIsRendered(true);
    } catch (error) {
      console.error("Error rendering DOCX:", error);
      if (previewContainerRef.current) {
        previewContainerRef.current.innerHTML =
          '<p style="color: red; padding: 2rem;">Error loading document. Please ensure it is a valid .docx file.</p>';
      }
    } finally {
      setIsConverting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExportPdf = useCallback(async () => {
    if (!isRendered || !file || !previewContainerRef.current) return;
    setIsExporting(true);

    try {
      // Gather the rendered HTML and styles from the preview container
      const renderedHTML = previewContainerRef.current.innerHTML;

      // Collect all style tags that docx-preview injected
      const styleElements = previewContainerRef.current.querySelectorAll("style");
      let styles = "";
      styleElements.forEach((el) => {
        styles += el.outerHTML;
      });

      // Build a standalone HTML document for printing
      const printHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${file.name.replace(/\.docx$/i, "")}</title>
  ${styles}
  <style>
    /* Reset */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: auto;
      background: #fff;
      color: #000;
      font-family: 'Calibri', 'Arial', sans-serif;
    }

    /* Page setup for print */
    @page {
      size: A4;
      margin: 0;
    }

    /* docx-preview wrapper section styling */
    .docx-wrapper {
      background: #fff !important;
      padding: 0 !important;
    }

    .docx-wrapper > section.docx {
      box-shadow: none !important;
      margin: 0 auto !important;
      padding: 1in !important;
      min-height: auto !important;
    }

    /* Print-specific overrides */
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .docx-wrapper {
        background: #fff !important;
        padding: 0 !important;
      }

      .docx-wrapper > section.docx {
        box-shadow: none !important;
        margin: 0 !important;
        page-break-after: always;
        width: 100% !important;
      }

      .docx-wrapper > section.docx:last-child {
        page-break-after: auto;
      }

      /* Avoid breaking inside important elements */
      table { page-break-inside: avoid; }
      img { page-break-inside: avoid; }
      p { orphans: 3; widows: 3; }
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        orphans: 3;
        widows: 3;
      }
    }

    /* Screen-only: show pages nicely for the brief moment before print */
    @media screen {
      body {
        background: #fff;
      }
      .docx-wrapper > section.docx {
        margin: 0 auto;
      }
    }
  </style>
</head>
<body>
  ${renderedHTML}
</body>
</html>`;

      // Open a new window and trigger print (which allows "Save as PDF")
      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (!printWindow) {
        alert("Please allow popups for this site to download the PDF.");
        return;
      }

      printWindow.document.write(printHTML);
      printWindow.document.close();

      // Wait for content + images/fonts to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          // Close after a delay to ensure print dialog completes
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        }, 500);
      };

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, [isRendered, file]);

  const handleClear = useCallback(() => {
    setFile(null);
    setIsRendered(false);
    docxBlobRef.current = null;
    if (previewContainerRef.current) {
      previewContainerRef.current.innerHTML = "";
    }
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
                Print dialog opened!
              </p>
              <p className="text-xs text-green-400/70 font-medium">
                Select &quot;Save as PDF&quot; as the destination to download your PDF
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

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-white hover:bg-white/5 transition-all"
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

            <button
              onClick={handleClear}
              disabled={!isRendered}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm font-bold text-muted-foreground hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Clear preview"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {file && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <FileText className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-medium text-white max-w-[200px] truncate">
                  {file.name}
                </span>
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={handleExportPdf}
              disabled={isExporting || !isRendered || isConverting}
              className={`group flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-base font-bold transition-all duration-300 ${
                isExporting
                  ? "bg-green-500/20 text-green-400 cursor-wait"
                  : isRendered
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-[0_0_30px_rgba(225,29,72,0.35)] hover:scale-[1.03] active:scale-[0.97] animate-pulse-glow"
                    : "bg-white/5 text-muted-foreground cursor-not-allowed"
              } disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none`}
              id="export-button"
            >
              {isExporting ? (
                <>
                  <Check className="w-5 h-5" />
                  Opening Print...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                  <MousePointerClick className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 flex flex-col rounded-2xl border border-border overflow-hidden bg-[#0d0d15]"
          style={{ minHeight: "calc(100vh - 28rem)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-sm font-bold text-muted-foreground ml-2">
                <Eye className="w-4 h-4 inline mr-1.5" />
                Document Preview
              </span>
            </div>
            {isConverting && (
              <span className="text-xs font-semibold text-rose-400 animate-pulse">
                Rendering document...
              </span>
            )}
          </div>

          {/* Preview Area */}
          {isRendered ? (
            <div className="flex-1 bg-[#e8e8e8] overflow-auto flex justify-center py-6">
              <div
                ref={previewContainerRef}
                className="docx-preview-container"
              />
            </div>
          ) : (
            <>
              {/* Hidden container for rendering (docx-preview needs a DOM node) */}
              <div
                ref={previewContainerRef}
                className="docx-preview-container"
                style={{ display: isConverting ? "block" : "none", position: "absolute", left: "-9999px" }}
              />
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                {isConverting ? (
                  <>
                    <div className="w-20 h-20 rounded-3xl bg-surface border border-border flex items-center justify-center mb-6 shadow-xl">
                      <div className="w-8 h-8 border-3 border-rose-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Rendering Document...</h3>
                    <p className="text-muted-foreground">
                      Processing your Word document with high-fidelity rendering
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-3xl bg-surface border border-border flex items-center justify-center mb-6 shadow-xl">
                      <UploadCloud className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Upload a Word Document</h3>
                    <p className="text-muted-foreground mb-8 max-w-md">
                      Select a .docx file from your computer to preview its contents and convert it into a beautifully formatted PDF.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
                    >
                      Browse Files
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* Info Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-start gap-3 p-5 rounded-xl glass text-sm text-muted-foreground"
        >
          <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-rose-500" />
          <div className="space-y-1">
            <p>
              <strong className="text-white">Privacy First:</strong> Your
              documents are processed entirely in your browser. Nothing is sent to
              any server.
            </p>
            <p>
              <strong className="text-white">How it works:</strong>{" "}
              Click &quot;Download PDF&quot; to open the print dialog. Select <strong className="text-white">&quot;Save as PDF&quot;</strong> as
              the destination for a high-quality, text-selectable PDF with preserved formatting.
            </p>
            <p>
              <strong className="text-white">Supported formats:</strong>{" "}
              Modern Word documents (.docx) with full support for text formatting, tables, images, headers, and page layouts.
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
                a: "Upload your .docx file using the 'Select Word Document' button, view the high-fidelity preview, then click 'Download PDF'. In the print dialog, select 'Save as PDF' as the destination.",
              },
              {
                q: "Is the PDF text-selectable?",
                a: "Yes! Unlike screenshot-based converters, this tool produces native PDFs where text remains selectable, searchable, and copy-pasteable.",
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
