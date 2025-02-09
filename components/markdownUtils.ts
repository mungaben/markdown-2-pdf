import { toast } from "@/hooks/use-toast";
import { playSound } from "./soundUtils";
import { getDefaultFileName } from "./fileUtils";

export const exportToMarkdown = (content: string): void => {
  const fileName = getDefaultFileName(content, "md");
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast({ title: "Success", description: `Markdown file "${fileName}" exported successfully!` });
  playSound("/sounds/success.mp3");
};