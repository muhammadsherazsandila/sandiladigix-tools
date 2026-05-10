import {
  FileText,
  Image,
  Code,
  Palette,
  Hash,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface Tool {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  gradient: string;
  category: string;
  tags: string[];
  isNew?: boolean;
  comingSoon?: boolean;
}

export const categories = [
  "All",
  "Document",
  "Image",
  "Developer",
  "Design",
  "Text",
  "Utility",
] as const;

export const tools: Tool[] = [
  {
    name: "Markdown to Word",
    slug: "markdown-to-word",
    description: "Convert Markdown to beautifully formatted DOCX files with live preview.",
    longDescription:
      "Transform your Markdown content into professionally formatted Microsoft Word documents. Features a powerful live editor with real-time preview, support for headings, lists, tables, code blocks, and more. Export with a single click.",
    icon: FileText,
    gradient: "from-violet-500 to-indigo-600",
    category: "Document",
    tags: ["markdown", "word", "docx", "converter", "document"],
    isNew: true,
  },
  {
    name: "Word to PDF",
    slug: "word-to-pdf",
    description: "Convert Word documents (DOCX) to PDF format entirely in your browser.",
    longDescription:
      "A fast and secure client-side converter that turns your Microsoft Word (.docx) files into PDF documents. No server uploads required—your files stay on your device.",
    icon: FileText,
    gradient: "from-red-500 to-rose-600",
    category: "Document",
    tags: ["word", "pdf", "docx", "converter", "document"],
    isNew: true,
  },
  {
    name: "Image Compressor",
    slug: "image-compressor",
    description: "Compress images without losing quality. Supports PNG, JPEG, WebP.",
    longDescription: "Reduce image file sizes significantly while maintaining visual quality.",
    icon: Image,
    gradient: "from-emerald-500 to-teal-600",
    category: "Image",
    tags: ["image", "compress", "optimize", "png", "jpeg"],
    comingSoon: true,
  },
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, validate, and beautify JSON data with syntax highlighting.",
    longDescription: "A powerful JSON tool for formatting, validating, and exploring JSON data.",
    icon: Code,
    gradient: "from-amber-500 to-orange-600",
    category: "Developer",
    tags: ["json", "format", "validate", "developer"],
    comingSoon: true,
  },
  {
    name: "Color Palette Generator",
    slug: "color-palette-generator",
    description: "Generate stunning color palettes for your next design project.",
    longDescription: "Create harmonious color palettes with advanced color theory.",
    icon: Palette,
    gradient: "from-pink-500 to-rose-600",
    category: "Design",
    tags: ["color", "palette", "design", "css"],
    comingSoon: true,
  },
  {
    name: "Hash Generator",
    slug: "hash-generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text.",
    longDescription: "Compute cryptographic hashes for text and files.",
    icon: Hash,
    gradient: "from-cyan-500 to-blue-600",
    category: "Developer",
    tags: ["hash", "md5", "sha", "security", "crypto"],
    comingSoon: true,
  },
  {
    name: "Text Transformer",
    slug: "text-transformer",
    description: "Transform text between cases: camelCase, snake_case, UPPERCASE, and more.",
    longDescription: "A comprehensive text transformation tool for developers and writers.",
    icon: Zap,
    gradient: "from-fuchsia-500 to-purple-600",
    category: "Text",
    tags: ["text", "transform", "case", "convert"],
    comingSoon: true,
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}
