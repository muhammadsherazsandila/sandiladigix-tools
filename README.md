# Sandiladigix Tools

A modern web-based document conversion platform built with Next.js. Convert between multiple document formats with a beautiful, intuitive interface.

## 🎯 Features

- **Markdown to Word (DOCX)** - Convert Markdown content to beautifully formatted Microsoft Word documents with live preview
- **Word to PDF** - Convert DOCX files to PDF format directly in your browser
- **Live Preview** - Real-time preview of your conversions as you work
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Client-Side Processing** - Your files stay private and are never uploaded to servers
- **Modern UI** - Built with Tailwind CSS and Framer Motion for smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/muhammadsherazsandila/sandiladigix-tools.git
cd sandiladigix-tools
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── markdown-to-word/   # Markdown to DOCX converter
│   ├── word-to-pdf/        # DOCX to PDF converter
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable React components
│   ├── ToolCard.tsx        # Tool card component
│   ├── Navbar.tsx          # Navigation bar
│   └── Footer.tsx          # Footer
└── lib/                    # Utility functions
    ├── markdown-to-docx.ts # Markdown conversion logic
    └── tools-data.ts       # Tools metadata
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with React 19
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Document Processing**:
  - [docx](https://www.npmjs.com/package/docx) - Create/read Word documents
  - [marked](https://marked.js.org) - Parse Markdown
  - [docx-preview](https://www.npmjs.com/package/docx-preview) - Preview DOCX files
  - [file-saver](https://www.npmjs.com/package/file-saver) - Download files
- **Icons**: [Lucide React](https://lucide.dev)

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🎨 Key Components

### ToolCard

Displays individual tool cards with icons, descriptions, and links to converter pages.

### Markdown to Word Converter

- Live editor with syntax highlighting
- Real-time DOCX preview
- Support for headings, lists, tables, code blocks, and more
- One-click download

### Word to PDF Converter

- Upload DOCX files
- Convert to PDF in the browser
- Download converted PDF

## 🔐 Privacy

All document conversions happen entirely on your device. Files are processed locally and never sent to any server.

## 👤 Author

Created by [Muhammad Sheraz Sandila](https://github.com/muhammadsherazsandila)

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.
