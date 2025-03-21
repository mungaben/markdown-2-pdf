# markdown-2-pdf
# Markdown to PDF Converter

A simple and easy-to-use **Markdown to PDF Converter** built with **Next.js**, **ReactMarkdown**, **jsPDF**, and **html2canvas**. This project allows you to convert Markdown content into a downloadable PDF file with just a few clicks. It's designed to be lightweight, customizable, and easy to extend for additional features like Markdown to Word or other document formats.

---

## Features

- **Markdown to PDF**: Convert Markdown content into a downloadable PDF.
- **Live Preview**: See a live preview of the Markdown content as you type.
- **Copy Markdown**: Copy the Markdown content to your clipboard with one click.
- **Easy to Extend**: Add support for more formats like Word, HTML, or plain text.
- **Customizable Styling**: Easily customize the PDF styling and layout.

---

## Technologies Used

- **Next.js**: For server-side rendering and routing.
- **ReactMarkdown**: For rendering Markdown content in React.
- **jsPDF**: For generating PDF files.
- **html2canvas**: For converting HTML content into a canvas for PDF generation.
- **Tailwind CSS**: For styling the UI (optional).

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/markdown-to-pdf.git
   cd markdown-to-pdf
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## How It Works

1. **Markdown Input**: Enter your Markdown content in the textarea.
2. **Live Preview**: The Markdown content is rendered in real-time using `ReactMarkdown`.
3. **Generate PDF**: Click the "Download PDF" button to convert the Markdown content into a PDF using `jsPDF` and `html2canvas`.
4. **Copy Markdown**: Click the "Copy Markdown" button to copy the Markdown content to your clipboard.

---

## Adding More Features

### 1. **Markdown to Word**
You can extend the project to support Markdown to Word conversion using libraries like `mammoth` or `pandoc`.

### 2. **Markdown to HTML**
Use `ReactMarkdown` to render Markdown as HTML and save it as an `.html` file.

### 3. **Custom Styling**
Customize the PDF styling by adding CSS classes to the Markdown preview and using `html2canvas` to capture the styled content.

---

## Why This Project?

- **Simple and Lightweight**: No unnecessary dependencies or bloat.
- **Easy to Extend**: Add support for more formats or features with minimal effort.
- **Customizable**: Tailor the styling and functionality to your needs.

---

## Contributing

Contributions are welcome! If you'd like to add a new feature or improve the project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or feedback, feel free to reach out:

- **Email**: kamaumungai3742@gmail.com


---

Enjoy converting Markdown to PDF with ease! 🚀