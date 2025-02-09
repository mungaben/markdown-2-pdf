import { marked } from "marked";
import { toast } from "@/hooks/use-toast";
import { playSound } from "./soundUtils";
import { getDefaultFileName } from "./fileUtils";

// Helper function to extract plain text from Markdown content
const getPlainText = async (markdown: string): Promise<string> => {
  const html = await marked.parseInline(markdown); // Await if parseInline is asynchronous
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// Generate plain text from Markdown content
export const generatePlainText = async (content: string): Promise<string> => {
  const parsedContent = marked.lexer(content);

  // Process each Markdown element asynchronously
  const processedContent = await parsedContent.reduce(async (accPromise: Promise<string>, item: any) => {
    const acc = await accPromise; // Resolve the accumulated content

    switch (item.type) {
      case "heading":
        // Handle headings (e.g., # Heading)
        const headingText = await getPlainText(item.text);
        return `${acc}${"\n".repeat(2)}${"#".repeat(item.depth)} ${headingText}\n`;

      case "paragraph":
        // Handle paragraphs
        const paragraphText = await getPlainText(item.text);
        return `${acc}${"\n".repeat(2)}${paragraphText}\n`;

      case "list":
        // Handle lists (both ordered and unordered)
        const listItems = await Promise.all(
          item.items.map(async (listItem: any) => {
            const listItemText =
              typeof listItem === "string"
                ? await getPlainText(listItem)
                : await getPlainText(listItem.text);
            return `• ${listItemText}`;
          })
        );
        return `${acc}${"\n".repeat(2)}${listItems.join("\n")}\n`;

      case "code":
        // Handle code blocks
        return `${acc}${"\n".repeat(2)}\`\`\`\n${item.text}\n\`\`\`\n`;

      case "blockquote":
        // Handle blockquotes
        const blockquoteText = await getPlainText(item.text);
        return `${acc}${"\n".repeat(2)}> ${blockquoteText}\n`;

      case "hr":
        // Handle horizontal rules
        return `${acc}${"\n".repeat(2)}---\n`;

      default:
        // Ignore unsupported elements
        console.warn(`Unsupported Markdown element type: ${item.type}`);
        return acc;
    }
  }, Promise.resolve("")); // Start with an empty string as the initial accumulator

  return processedContent.trim();
};

// Download plain text file
export const downloadPlainText = async (content: string): Promise<void> => {
  try {
    const plainText = await generatePlainText(content); // Await the plain text generation
    const fileName = getDefaultFileName(content, "txt");

    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "Success", description: `Plain text file "${fileName}" downloaded successfully!` });
    playSound("/sounds/success.mp3");
  } catch (error) {
    console.error("Error generating plain text:", error);
    toast({ title: "Error", description: "Failed to generate plain text file." });
  }
};