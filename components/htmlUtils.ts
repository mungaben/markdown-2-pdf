import { marked } from "marked";
import { toast } from "@/hooks/use-toast";
import { playSound } from "./soundUtils";
import { getDefaultFileName } from "./fileUtils";

export const exportToHTML = async (content: string): Promise<void> => {
  const htmlContent = await marked(content);
  const fileName = getDefaultFileName(content, "html");
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast({ title: "Success", description: `HTML file "${fileName}" exported successfully!` });
  playSound("/sounds/success.mp3");
};