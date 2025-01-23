'use client';

import { useState } from 'react';

import { generatePDF } from '@/lib/pdf-utils';
import { PDFExportButton } from '@/components/pdf/exportButton';
import { MarkdownEditor } from '@/components/pdf/markdownEditor';
import { PDFPreview } from '@/components/pdf/pdfPreview';

const DEFAULT_MARKDOWN = `# Professional Document

## Introduction
This is a professional document created using Markdown. The generated PDF will maintain proper A4 formatting.

## Features
- Professional A4 formatting
- Clean typography
- Proper margins
- High-quality PDF export

## Usage
1. Write your content in Markdown
2. Preview the formatted result
3. Export to PDF with one click

---

*Created with the PDF Generator*`;

export default function Home() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  const handleExportPDF = async () => {
    const element = document.getElementById('markdown-preview');
    if (!element) return;
    await generatePDF(element);
  };

  return (
    <main className="min-h-screen p-6 bg-background">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">PDF Generator</h1>
          <PDFExportButton onExport={handleExportPDF} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <MarkdownEditor 
            value={markdown}
            onChange={setMarkdown}
          />
          <PDFPreview content={markdown} />
        </div>
      </div>
    </main>
  );
}