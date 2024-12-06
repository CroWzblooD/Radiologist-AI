"use client"
import { useEffect } from 'react';
import { initGemini } from '@/lib/gemini';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      initGemini(apiKey);
    } else {
      console.error('API key is missing');
    }
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
