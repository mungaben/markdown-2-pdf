// Function to format content for export
export const getFormattedContent = (element: HTMLElement): string => {
    const clone = element.cloneNode(true) as HTMLElement;
  
    // Define styles for different HTML elements
    const styleMap = {
      h1: "font-size: 24pt; font-weight: bold; margin-bottom: 12pt;",
      h2: "font-size: 18pt; font-weight: bold; margin-top: 14pt; margin-bottom: 10pt;",
      h3: "font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 8pt;",
      p: "font-size: 11pt; margin-bottom: 8pt; line-height: 1.5;",
      ul: "margin-left: 20pt; margin-bottom: 8pt;",
      ol: "margin-left: 20pt; margin-bottom: 8pt;",
      li: "margin-bottom: 4pt;",
    } as const;
  
    // Replace HTML tags with styled versions
    return clone.innerHTML.replace(/<(h[1-3]|p|ul|ol|li)([^>]*)>/g, (_, tag, attrs) => {
      const validTag = tag as keyof typeof styleMap;
      return `<${validTag} style="${styleMap[validTag]}"${attrs}>`;
    });
  };