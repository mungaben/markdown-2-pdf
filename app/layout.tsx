import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Markdown to PDF Converter - Convert Markdown to PDF Easily',
  description:
    'A simple and powerful tool to convert Markdown content into downloadable PDF files. Perfect for developers, writers, and anyone who needs to create professional documents from Markdown.',
  keywords: [
    'Markdown to PDF',
    'PDF Converter',
    'Markdown Editor',
    'Next.js PDF Generator',
    'ReactMarkdown',
    'jsPDF',
    'html2canvas',
  ],
  authors: [
    {
      name: 'Your Name',
      url: 'https://github.com/mungaben',
    },
  ],
  openGraph: {
    title: 'Markdown to PDF Converter - Convert Markdown to PDF Easily',
    description:
      'A simple and powerful tool to convert Markdown content into downloadable PDF files. Perfect for developers, writers, and anyone who needs to create professional documents from Markdown.',
    url: 'https://mungatech.vercel.app/',
    siteName: 'Markdown to PDF Converter',
    images: [
      {
        url: 'https://mungatech.vercel.app/og-image.png', // Add an OpenGraph image
        width: 1200,
        height: 630,
        alt: 'Markdown to PDF Converter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Markdown to PDF Converter - Convert Markdown to PDF Easily',
    description:
      'A simple and powerful tool to convert Markdown content into downloadable PDF files. Perfect for developers, writers, and anyone who needs to create professional documents from Markdown.',
    images: ['https://mungatech.vercel.app/og-image.png'], // Add a Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  themeColor: '#ffffff', // Add a theme color for better PWA support
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}