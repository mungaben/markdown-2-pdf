import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable"; // For table support
import { toast } from "@/hooks/use-toast";
import { playSound } from "./soundUtils";

// Augment the jsPDF type to include the lastAutoTable property
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number; // The Y position where the table ends
    };
  }
}

// Function to generate the PDF (captures all pages)
export const generateMultiPagePDF = async (element: HTMLElement, content: string): Promise<void> => {
  // Prompt for file name
  let fileName = prompt("Enter a name for your PDF file:", getDefaultFileName(content, "pdf"));
  if (!fileName) {
    fileName = getDefaultFileName(content, "pdf");
  }
  fileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;

  // Initialize PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margins = { top: 15, bottom: 15, left: 15, right: 15 };

  try {
    // Log the passed content for debugging
    console.log("Content passed to PDF generator:", content);

    // Capture the DOM element as a canvas (ensure full scrollable content is captured)
    const canvas = await captureFullDOMAsCanvas(element);

    // Convert the canvas to an image data URL
    const imgData = canvas.toDataURL("image/png", 1.0);

    // Calculate image dimensions for the PDF
    const imgWidth = pdfWidth - margins.left - margins.right;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the first page
    let yPosition = margins.top;
    let remainingHeight = imgHeight;

    // Dynamic pagination for large content
    while (remainingHeight > 0) {
      const pageHeight = pdfHeight - margins.top - margins.bottom;
      const pageImgHeight = Math.min(remainingHeight, pageHeight);

      // Add the image to the current page
      pdf.addImage(imgData, "PNG", margins.left, yPosition, imgWidth, pageImgHeight);

      // Update remaining height and position
      remainingHeight -= pageImgHeight;
      yPosition += pageImgHeight;

      // Add a new page if there's more content
      if (remainingHeight > 0) {
        pdf.addPage();
        yPosition = margins.top;
      }
    }

    // Handle additional pages (e.g., tables, lists, etc.)
    const additionalPages = extractAdditionalPages(content);
    additionalPages.forEach((pageContent) => {
      pdf.addPage();
      renderPageContent(pdf, pageContent, pdfWidth, pdfHeight, margins);
    });

    // Save the PDF
    pdf.save(fileName);
    toast({ title: "Success", description: `PDF "${fileName}" generated successfully!` });
    playSound("/sounds/success.mp3");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast({ title: "Error", description: "Failed to generate PDF." });
  }
};

// Helper function to get default file name
function getDefaultFileName(content: string, extension: string): string {
  const words = content.trim().split(/\s+/);
  const firstFewWords = words.slice(0, 3).join(" ");
  return `${firstFewWords.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${extension}`;
}

// Helper function to capture the full DOM as a canvas
async function captureFullDOMAsCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(element, {
    scale: 2, // Higher scale improves quality but increases processing time
    useCORS: true,
    logging: false,
    scrollX: 0,
    scrollY: -window.scrollY, // Adjust for scrolled pages
    allowTaint: false, // Prevent tainted canvases
    onclone: (clonedDoc) => {
      // Optionally apply custom styles or remove unnecessary elements
      clonedDoc.body.style.background = "#fff"; // Ensure a clean background
    },
  });
}

// Extract additional pages (e.g., tables, lists, etc.)
function extractAdditionalPages(content: string): string[] {
  // Example: Split content into pages based on some delimiter (e.g., "---")
  return content.split("---").filter((part) => part.trim() !== "");
}

// Render additional page content
function renderPageContent(
  pdf: jsPDF,
  content: string,
  pdfWidth: number,
  pdfHeight: number,
  margins: { top: number; bottom: number; left: number; right: number }
): void {
  const lines = pdf.splitTextToSize(content, pdfWidth - margins.left - margins.right);
  let yPosition = margins.top;

  lines.forEach((line: string) => {
    if (yPosition + 10 > pdfHeight - margins.bottom) {
      pdf.addPage();
      yPosition = margins.top;
    }
    pdf.text(line, margins.left, yPosition);
    yPosition += 10; // Adjust line height
  });

  // Handle tables in the content
  const tableData = extractTableData(content);
  tableData.forEach((table) => {
    if (yPosition + 20 > pdfHeight - margins.bottom) {
      pdf.addPage();
      yPosition = margins.top;
    }
    autoTable(pdf, {
      head: [table.head],
      body: table.body,
      startY: yPosition,
      theme: "grid",
    });
    yPosition = pdf.lastAutoTable?.finalY || yPosition + 20;
  });
}

// Helper function to extract table data from plain text or HTML
function extractTableData(content: string): { head: string[]; body: string[][] }[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const tables = Array.from(doc.querySelectorAll("table"));
  return tables.map((table) => {
    const rows = Array.from(table.querySelectorAll("tr"));
    const head = Array.from(rows[0].querySelectorAll("th, td")).map(
      (cell) => (cell.textContent || "").trim()
    );
    const body = rows.slice(1).map((row) =>
      Array.from(row.querySelectorAll("td")).map((cell) => (cell.textContent || "").trim())
    );
    return { head, body };
  });
}