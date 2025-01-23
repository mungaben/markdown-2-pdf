'use client';

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

export function getFormattedContent(element: HTMLElement): string {
  // Clean up the content for better paste results
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Convert specific elements to their Word/Google Docs equivalents
  const content = clone.innerHTML
    .replace(/<h1/g, '<p style="font-size: 24pt; font-weight: bold;"')
    .replace(/<h2/g, '<p style="font-size: 18pt; font-weight: bold;"')
    .replace(/<h3/g, '<p style="font-size: 14pt; font-weight: bold;"')
    .replace(/<\/h[1-6]>/g, '</p>')
    .replace(/<p>/g, '<p style="font-size: 12pt; margin-bottom: 1em;">')
    .replace(/<ul>/g, '<ul style="margin-left: 2em; margin-bottom: 1em;">')
    .replace(/<li>/g, '<li style="margin-bottom: 0.5em;">');

  return content;
}