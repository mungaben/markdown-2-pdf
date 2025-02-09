import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";
import { playSound } from "./soundUtils";

// Function to generate a PDF
export const generatePDF = async (element: HTMLElement, content: string): Promise<void> => {
  let fileName = prompt("Enter a name for your PDF file:", getDefaultFileName(content, "pdf"));
  if (!fileName) {
    fileName = getDefaultFileName(content, "pdf");
  }
  fileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margins = 15; // margins in mm

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 1.0);
  const imgWidth = pdfWidth - margins * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", margins, margins, imgWidth, imgHeight);
  heightLeft -= pdfHeight - margins * 2;

  while (heightLeft > 0) {
    position += pdfHeight - margins * 2;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", margins, -(position - margins), imgWidth, imgHeight);
    heightLeft -= pdfHeight - margins * 2;
  }

  pdf.save(fileName);
  toast({ title: "Success", description: `PDF "${fileName}" generated successfully!` });
  playSound("/sounds/success.mp3");
};

function getDefaultFileName(content: string, extension: string): string {
  const words = content.trim().split(/\s+/);
  const firstFewWords = words.slice(0, 3).join(" ");
  return `${firstFewWords.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${extension}`;
}