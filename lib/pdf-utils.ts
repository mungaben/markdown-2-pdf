'use client';

export async function generatePDF(element: HTMLElement): Promise<void> {
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  // A4 dimensions in mm
  const a4Width = 210;
  const a4Height = 297;

  // Convert mm to pixels (assuming 96 DPI)
  const pixelsPerMm = 96 / 25.4;
  const widthInPx = a4Width * pixelsPerMm;
  const heightInPx = a4Height * pixelsPerMm;

  // Initialize PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Function to split content into pages
  const splitContentIntoPages = async (element: HTMLElement) => {
    let position = 0; // Tracks the vertical position of the content
    let pageNumber = 1;

    while (position < element.scrollHeight) {
      // Create a canvas for the current page
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        width: widthInPx,
        height: heightInPx,
        windowWidth: widthInPx,
        windowHeight: heightInPx,
        y: position, // Start capturing from the current position
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Add the canvas as a new page in the PDF
      if (pageNumber > 1) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, a4Width, a4Height);

      // Move to the next page
      position += heightInPx;
      pageNumber++;
    }
  };

  // Split content into pages and generate PDF
  await splitContentIntoPages(element);

  // Save the PDF
  pdf.save('document.pdf');
}