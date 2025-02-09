import PptxGenJS from "pptxgenjs";

export const exportToPowerPoint = (content: string) => {
  const pptx = new PptxGenJS();

  // Add a slide with the content
  const slide = pptx.addSlide();
  slide.addText(content, { x: 1, y: 1, fontSize: 18 });

  // Save the .pptx file
  pptx.writeFile({fileName:"presentation.pptx"});
};