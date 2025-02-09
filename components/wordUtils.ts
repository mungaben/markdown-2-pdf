import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from "docx";
import { marked } from "marked";
import { toast } from "@/hooks/use-toast";
import { playSound } from "./soundUtils";
import { getDefaultFileName } from "./fileUtils";

// Helper function to extract plain text from Markdown content
const getPlainText = (markdown: string): string => {
  const div = document.createElement("div");
  div.innerHTML = markdown;
  return div.textContent || div.innerText || "";
};

export const generateWord = async (content: string): Promise<void> => {
  const parsedContent = marked.lexer(content);

  // Recursive function to process Markdown content
  const processContent = (items: any[], level = 0): any[] => {
    return items.flatMap((item: any) => {
      switch (item.type) {
        case "heading":
          // Handle headings
          return new Paragraph({
            text: getPlainText(item.text),
            heading: HeadingLevel[`HEADING_${item.depth}` as keyof typeof HeadingLevel],
            style: `Heading${item.depth}`,
          });

        case "paragraph":
          // Handle paragraphs
          return new Paragraph({
            children: [new TextRun(getPlainText(item.text))],
            spacing: { before: 100, after: 100 },
          });

        case "list":
          // Handle lists (unordered and ordered)
          return item.items.flatMap((listItem: any) =>
            new Paragraph({
              text: getPlainText(listItem.text),
              bullet: { level }, // Use only the valid `level` property
              spacing: { before: 50, after: 50 },
            })
          );

        case "code":
          // Handle code blocks
          return new Paragraph({
            children: [
              new TextRun({
                text: item.text,
                font: "Courier New",
                size: 22,
                color: "363636",
              }),
            ],
            shading: { fill: "F6F8FA" }, // Light background for code blocks
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: "E1E4E8" } },
            spacing: { before: 100, after: 100 },
          });

        case "table":
          // Handle tables (if present in Markdown)
          return new Table({
            rows: item.rows.map((row: any[]) =>
              new TableRow({
                children: row.map(
                  (cell: any) =>
                    new TableCell({
                      children: [new Paragraph(getPlainText(cell))],
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 4, color: "E1E4E8" },
                        bottom: { style: BorderStyle.SINGLE, size: 4, color: "E1E4E8" },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
                    })
                ),
              })
            ),
          });

        default:
          // Ignore unsupported elements
          console.warn(`Unsupported Markdown element type: ${item.type}`);
          return [];
      }
    });
  };

  // Create the Word document
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 24, font: "Calibri" },
          paragraph: { spacing: { line: 276, before: 0, after: 200 } },
        },
        ...Array.from({ length: 3 }, (_, i) => ({
          id: `Heading${i + 1}`,
          name: `Heading ${i + 1}`,
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 36 - i * 4, bold: true, color: "2D2D2D", font: "Calibri" },
          paragraph: { spacing: { before: 240, after: 120 } },
        })),
      ],
    },
    sections: [
      {
        properties: {},
        children: processContent(parsedContent),
      },
    ],
  });

  // Save and download the Word document
  const blob = await Packer.toBlob(doc);
  const fileName = getDefaultFileName(content, "docx");
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast({ title: "Success", description: `Word document "${fileName}" generated successfully!` });
  playSound("/sounds/success.mp3");
};