import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word to PDF Converter — Convert DOCX to PDF Online Free",
  description:
    "Convert Word documents (DOCX) to beautifully formatted PDF documents online for free. Fast, secure, and accurate client-side conversion. No sign-up required. Privacy-first — your data never leaves your browser.",
  keywords: [
    "word to pdf",
    "docx to pdf",
    "word to pdf converter",
    "convert word to pdf",
    "word converter online",
    "free word to pdf",
    "docx to pdf online",
    "word export pdf",
  ],
  openGraph: {
    title: "Word to PDF Converter — Convert DOCX to PDF Online Free",
    description:
      "Convert Word documents to PDF instantly. Fast, private, and no sign-up.",
    url: "https://tools.sandiladigix.com/word-to-pdf",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Word to PDF Converter — SandilaDigiX Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Word to PDF Converter — Convert DOCX to PDF Online Free",
    description:
      "Convert Word documents to PDF instantly. Free, private, no sign-up.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://tools.sandiladigix.com/word-to-pdf",
  },
};

export default function WordToPdfLayout({
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
            name: "Word to PDF Converter",
            url: "https://tools.sandiladigix.com/word-to-pdf",
            description:
              "Convert Word documents (DOCX) to PDF online for free.",
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
              "Instant Word to PDF conversion",
              "Client-side processing",
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
                name: "Word to PDF",
                item: "https://tools.sandiladigix.com/word-to-pdf",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
