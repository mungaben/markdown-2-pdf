import { toast } from "@/hooks/use-toast";

// Function to copy content to clipboard
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    toast({ title: "Success", description: "Copied to clipboard!" });
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    toast({ title: "Success", description: "Copied to clipboard!" });
  }
};