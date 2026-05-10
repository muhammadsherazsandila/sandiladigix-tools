import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tools.sandiladigix.com"),
  title: {
    default: "SandilaDigiX Tools — Free Online Developer & Creator Tools",
    template: "%s | SandilaDigiX Tools",
  },
  description:
    "Free, fast, and privacy-first online tools for developers, designers, and creators. Convert Markdown to Word, compress images, format JSON, and more — all in your browser.",
  keywords: [
    "online tools",
    "developer tools",
    "markdown to word",
    "docx converter",
    "free tools",
    "SandilaDigiX",
    "image compressor",
    "json formatter",
    "web tools",
    "privacy first tools",
  ],
  authors: [{ name: "SandilaDigiX", url: "https://sandiladigix.com" }],
  creator: "SandilaDigiX",
  publisher: "SandilaDigiX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tools.sandiladigix.com",
    siteName: "SandilaDigiX Tools",
    title: "SandilaDigiX Tools — Free Online Developer & Creator Tools",
    description:
      "Free, fast, and privacy-first online tools. Convert Markdown to Word, compress images, format JSON, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SandilaDigiX Tools — Free Online Developer & Creator Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SandilaDigiX Tools — Free Online Developer & Creator Tools",
    description:
      "Free, fast, and privacy-first online tools for developers, designers, and creators.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://tools.sandiladigix.com",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SandilaDigiX Tools",
              url: "https://tools.sandiladigix.com",
              description:
                "Free, fast, and privacy-first online tools for developers, designers, and creators.",
              publisher: {
                "@type": "Organization",
                name: "SandilaDigiX",
                url: "https://sandiladigix.com",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://tools.sandiladigix.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
