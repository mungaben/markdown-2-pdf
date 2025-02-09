import pptxgen from "pptxgenjs";
import { marked } from "marked";
import { toast } from "@/hooks/use-toast";
import { playSound } from "./soundUtils";
import { getDefaultFileName } from "./fileUtils";

const getPlainText = async (markdown: string): Promise<string> => {
    const html = await marked.parseInline(markdown); // Await if parseInline is asynchronous
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
  
  // Improved PowerPoint generation
  export const generatePPTX = async (content: string): Promise<void> => {
    const pptx = new pptxgen();
    const parsedContent = marked.lexer(content);
    let slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    let yPos = 0.5; // Vertical position on the slide
    let listDepth = 0; // Tracks nested list depth
  
    // Define slide master layout
    pptx.defineSlideMaster({
      title: "MASTER_SLIDE",
      background: { color: "FFFFFF" },
      objects: [],
      slideNumber: { x: 0.5, y: "95%" },
    });
  
    // Process each parsed Markdown element
    for (const item of parsedContent) {
      switch (item.type) {
        case "heading": {
          if (yPos > 4.5) {
            slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
            yPos = 0.5;
          }
          const headingText = await getPlainText(item.text); // Resolve text asynchronously
          slide.addText(headingText, {
            x: 0.5,
            y: yPos,
            w: "90%",
            fontSize: 28 - item.depth * 4, // Adjust font size based on heading level
            bold: true,
            color: "2D2D2D",
            margin: [0, 0.2, 0, 0.2],
          });
          yPos += 0.8;
          break;
        }
  
        case "paragraph": {
          if (yPos > 5) {
            slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
            yPos = 0.5;
          }
          const paragraphText = await getPlainText(item.text); // Resolve text asynchronously
          slide.addText(paragraphText, {
            x: 0.5,
            y: yPos,
            w: "90%",
            fontSize: 14,
            color: "4A4A4A",
            lineSpacing: 1.2,
          });
          yPos += 0.6;
          break;
        }
  
        case "list": {
          // Handle both ordered and unordered lists
          for (const listItem of item.items) {
            if (yPos > 5) {
              slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
              yPos = 0.5;
              listDepth = 0; // Reset list depth on new slide
            }
  
            // Ensure listItem.text exists or fallback to raw value
            const listItemText =
              typeof listItem === "string"
                ? listItem
                : await getPlainText(listItem.text); // Resolve text asynchronously
  
            slide.addText(listItemText, {
              x: 0.5 + listDepth * 0.5, // Indent based on list depth
              y: yPos,
              w: "90%",
              fontSize: 14,
              color: "4A4A4A",
              bullet: {
                type: item.ordered ? "number" : "bullet", // Ordered or unordered list
                code: item.ordered ? "numDecimalCircle" : "bullet",
                indent: 0.5,
                startAt: item.start || 1, // Start numbering from specified value
              },
            });
            yPos += 0.4;
  
            // Handle nested lists
            if (listItem.items && Array.isArray(listItem.items)) {
              listDepth += 1; // Increase depth for nested lists
              for (const nestedItem of listItem.items) {
                const nestedItemText = await getPlainText(nestedItem.text); // Resolve text asynchronously
                slide.addText(nestedItemText, {
                  x: 0.5 + listDepth * 0.5,
                  y: yPos,
                  w: "90%",
                  fontSize: 14,
                  color: "4A4A4A",
                  bullet: {
                    type: "bullet",
                    code: "bullet",
                    indent: 0.5,
                  },
                });
                yPos += 0.4;
              }
              listDepth -= 1; // Decrease depth after processing nested items
            }
          }
          break;
        }
  
        case "code": {
          if (yPos > 4.5) {
            slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
            yPos = 0.5;
          }
          const codeText = await getPlainText(item.text); // Resolve text asynchronously
          slide.addText(codeText, {
            x: 0.5,
            y: yPos,
            w: "90%",
            fontSize: 12,
            fontFace: "Courier New",
            color: "3A3A3A",
            fill: { color: "F6F8FA" }, // Light background for code blocks
          });
          yPos += 0.6;
          break;
        }
  
        default: {
          console.warn(`Unsupported Markdown element type: ${item.type}`);
          break;
        }
      }
    }
  
    // Save the PowerPoint file
    const fileName = getDefaultFileName(content, "pptx");
    await pptx.writeFile({ fileName });
    toast({ title: "Success", description: `PowerPoint "${fileName}" generated!` });
  };