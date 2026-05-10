import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown to Word Converter — Convert MD to DOCX Online Free",
  description:
    "Convert Markdown to beautifully formatted Word documents (DOCX) online for free. Live preview, support for headings, lists, tables, code blocks, and more. No sign-up required. Privacy-first — your data never leaves your browser.",
  keywords: [
    "markdown to word",
    "md to docx",
    "markdown to docx converter",
    "convert markdown to word",
    "markdown converter online",
    "free markdown to word",
    "md to word online",
    "markdown export docx",
  ],
  openGraph: {
    title: "Markdown to Word Converter — Convert MD to DOCX Online Free",
    description:
      "Convert Markdown to Word documents instantly. Live preview with rich formatting support. Free, private, no sign-up.",
    url: "https://tools.sandiladigix.com/markdown-to-word",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Markdown to Word Converter — SandilaDigiX Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown to Word Converter — Convert MD to DOCX Online Free",
    description:
      "Convert Markdown to Word documents instantly. Free, private, no sign-up.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://tools.sandiladigix.com/markdown-to-word",
  },
};

export default function MarkdownToWordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD for this specific tool */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Markdown to Word Converter",
            url: "https://tools.sandiladigix.com/markdown-to-word",
            description:
              "Convert Markdown to beautifully formatted Word documents (DOCX) online for free.",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "All",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            publisher: {
              "@type": "Organization",
              name: "SandilaDigiX",
              url: "https://sandiladigix.com",
            },
            featureList: [
              "Live Markdown preview",
              "Export to DOCX format",
              "Support for headings, lists, tables, code blocks",
              "Privacy-first — runs entirely in browser",
              "No sign-up required",
            ],
          }),
        }}
      />
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://tools.sandiladigix.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Markdown to Word",
                item: "https://tools.sandiladigix.com/markdown-to-word",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
