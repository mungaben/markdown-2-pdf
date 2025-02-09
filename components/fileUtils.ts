export function getDefaultFileName(content: string, extension: string): string {
    const words = content.trim().split(/\s+/);
    const firstFewWords = words.slice(0, 3).join(" ");
    return `${firstFewWords.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${extension}`;
  }