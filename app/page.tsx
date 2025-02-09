"use client";
import { ExportButton } from "@/components/ExportButton";
import { exportToHTML } from "@/components/htmlUtils";
import { exportToMarkdown } from "@/components/markdownUtils";
import { MarkdownEditor } from "@/components/pdf/markdownEditor";
import PDFPreview from "@/components/pdf/pdfPreview";
import { generatePDF } from "@/components/pdfUtils";
import { downloadPlainText } from "@/components/plainTextUtils";
import { generatePPTX } from "@/components/pptxUtils";
import { generateWord } from "@/components/wordUtils";
import { useState } from "react";

const DEFAULT_MARKDOWN = `# Enhanced Document Generator Test Suite

## Introduction
This is a comprehensive test document designed to evaluate the capabilities of the Enhanced Document Generator. The goal is to ensure proper formatting across all supported export formats: PDF, PowerPoint, Word, Plain Text, Markdown, and HTML.

---

## Headings
### Heading Level 3
#### Heading Level 4
##### Heading Level 5
###### Heading Level 6

---

## Paragraphs
This is a standard paragraph. It contains some **bold text**, _italicized text_, and even ~~strikethrough text~~. You can also include inline code like \`console.log("Hello, World!")\`.

Another paragraph with a [hyperlink](https://example.com) and an email address: \`support@example.com\`.

---

## Lists

### Unordered List
- First item in an unordered list.
- Second item with **bold text**.
  - Nested item with _italicized text_.
- Third item.

### Ordered List
1. First item in an ordered list.
2. Second item with a link: [Example](https://example.com).
   1. Nested item with a code snippet: \`const x = 10;\`.
3. Third item.

---

## Code Blocks
Here’s an example of a JavaScript code block:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");
\`\`\`

And here’s a Python code block:

\`\`\`python
def add(a, b):
    return a + b

print(add(2, 3))
\`\`\`

---

## Blockquotes
> This is a blockquote. It can span multiple lines and contain **formatted text** or _links_ like [this](https://example.com).

> Another blockquote:
>> With nested content.

---

## Tables
| Feature         | Description                     | Status       |
|-----------------|---------------------------------|--------------|
| Formatting      | Professional formatting        | ✅ Completed |
| Typography      | Clean typography               | ✅ Completed |
| Margins         | Proper margins                 | ❌ Pending   |
| Exports         | High-quality exports           | ✅ Completed |

---

## Images
![Sample Image](https://via.placeholder.com/150)

---

## Horizontal Rules
---

This is a horizontal rule above this line.

---

## Metadata
*Created with the Enhanced Document Generator*

---
`;

export default function Home() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  const handleExport = async (format: string) => {
    const element = document.getElementById("markdown-preview");
    if (!element) return;

    switch (format) {
      case "pdf":
        await generatePDF(element, markdown);
        break;
      case "pptx":
        await generatePPTX(markdown);
        break;
      case "docx":
        await generateWord(markdown);
        break;
      case "txt":
        downloadPlainText(markdown);
        break;
      case "md":
        await exportToMarkdown(markdown);
        break;
      case "html":
        await exportToHTML(markdown);
        break;
      default:
        console.error("Unsupported format");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background-start-rgb to-background-end-rgb p-2 sm:p-4 md:p-6">
      <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
        <div className="backdrop-blur-lg bg-white/10 dark:bg-black/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-black/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
              Enhanced Document Generator
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4">
              <ExportButton onExport={() => handleExport("pdf")} format="PDF" />
              <ExportButton onExport={() => handleExport("pptx")} format="PowerPoint" />
              <ExportButton onExport={() => handleExport("docx")} format="Word" />
              <ExportButton onExport={() => handleExport("txt")} format="Plain Text" />
              <ExportButton onExport={() => handleExport("md")} format="Markdown" />
              <ExportButton onExport={() => handleExport("html")} format="HTML" />
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 h-[calc(100vh-120px)] sm:h-[calc(100vh-150px)]">
          <div className="backdrop-blur-lg bg-white/10 dark:bg-black/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-black/20 overflow-hidden">
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
          <div className="backdrop-blur-lg bg-white/10 dark:bg-black/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-black/20 overflow-hidden">
            <PDFPreview content={markdown} />
          </div>
        </div>
      </div>
    </main>
  );
}