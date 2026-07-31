import React from 'react';
import "./globals.css";
import { Providers } from './providers';
import type { Metadata } from 'next';
import logo from "./logo.jpeg";

export const metadata: Metadata = {
  title: 'SilkShine',
  description: 'SilkShine Industrial Lubricants',
  icons: {
    icon: [{ url: logo.src }], 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}